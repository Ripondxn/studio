
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { saveBill, getNextBillNumber as getNextVendorBillNumber } from '../vendors/bill/actions';
import { saveInvoice } from '../tenancy/customer/invoice/actions';
import { type UserRole } from '../admin/user-roles/schema';
import { addPayment } from '../finance/payment/actions';
import { getLookups as getPartyLookups } from '@/app/lookups/actions';

async function readVendors() {
    try {
        const vendorsFilePath = path.join(process.cwd(), 'src/app/vendors/vendors-data.json');
        await fs.access(vendorsFilePath);
        const data = await fs.readFile(vendorsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
         if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export { getPartyLookups };


export async function createBillFromDocument(data: any, isAutoBillNo: boolean, currentUser: UserRole) {
    try {
        const allVendors = await readVendors();
        const vendor = allVendors.find((v: any) => v.vendorData.code === data.vendorCode);

        if (!vendor) {
            return { success: false, error: 'Vendor not found.' };
        }
        
        const billData = {
            ...data,
            vendorName: vendor.vendorData.name,
            billDate: data.date,
            dueDate: data.dueDate || data.date,
            status: 'Paid' as const,
        };
        
        const billResult = await saveBill(billData, true, isAutoBillNo); 
        if (!billResult.success || !billResult.data) {
            throw new Error(billResult.error || 'Failed to save bill from document.');
        }

        const savedBill = billResult.data;
        const paymentRecord = {
            type: 'Payment' as const,
            date: savedBill.billDate,
            partyType: 'Vendor' as const,
            partyName: savedBill.vendorCode,
            amount: savedBill.total,
            paymentMethod: 'Bank Transfer' as const, 
            paymentFrom: 'Bank' as const, 
            referenceNo: savedBill.billNo,
            description: `Payment for Bill #${savedBill.billNo} from processed document.`,
            status: 'Paid' as const,
            billAllocations: [{ billId: savedBill.id, amount: savedBill.total }],
            createdByUser: currentUser.name,
            currentStatus: 'POSTED' as const,
            property: savedBill.property,
            unitCode: savedBill.unitCode,
            roomCode: savedBill.roomCode,
            utilityAccountId: savedBill.utilityAccountId,
             approvalHistory: [{
                action: 'Created & Auto-Posted via Document Processor',
                actorId: currentUser.email,
                actorRole: currentUser.role,
                timestamp: new Date().toISOString(),
                comments: `Automatically created and posted from an uploaded document.`
            }]
        };

        const paymentResult = await addPayment(paymentRecord);
        
        if(!paymentResult.success || !paymentResult.data) {
             throw new Error(paymentResult.error || 'Bill was saved, but failed to create the financial transaction.');
        }
        
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function createInvoiceFromDocument(data: any, currentUser: {name: string, email: string, role: UserRole['role']}) {
     try {
        const invoiceData = {
            ...data,
            isAutoInvoiceNo: true,
            status: 'Paid' as const,
        };

        const result = await saveInvoice(invoiceData, currentUser.name);
        if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to save invoice from document.');
        }
        
        const savedInvoice = result.data;

        const paymentRecord = {
            type: 'Receipt' as const,
            date: savedInvoice.invoiceDate,
            partyType: 'Customer' as const,
            partyName: savedInvoice.customerCode,
            amount: savedInvoice.total,
            paymentMethod: 'Bank Transfer' as const,
            paymentFrom: 'Bank' as const,
            referenceNo: savedInvoice.invoiceNo,
            description: `Payment for Invoice #${savedInvoice.invoiceNo} from processed document.`,
            status: 'Received' as const,
            invoiceAllocations: [{ invoiceId: savedInvoice.id, amount: savedInvoice.total }],
            createdByUser: currentUser.name,
            currentStatus: 'POSTED' as const,
            property: savedInvoice.property,
            unitCode: savedInvoice.unitCode,
            roomCode: savedInvoice.roomCode,
            expenseAccountId: data.expenseAccountId,
            approvalHistory: [{
                action: 'Created & Auto-Posted via Document Processor',
                actorId: currentUser.email,
                actorRole: currentUser.role,
                timestamp: new Date().toISOString(),
                comments: `Automatically created and posted from an uploaded document.`
            }]
        };
        
        const paymentResult = await addPayment(paymentRecord);
        if(!paymentResult.success || !paymentResult.data) {
             throw new Error(paymentResult.error || 'Invoice was saved, but failed to create the financial transaction.');
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function createReceiptFromDocument(data: any, currentUser: {name: string, email: string, role: UserRole['role']}) {
    try {
         const paymentRecord = {
            ...data,
            type: 'Receipt',
            status: 'Received',
            currentStatus: 'POSTED' as const,
             approvalHistory: [{
                action: 'Created & Auto-Posted via Document Processor',
                actorId: currentUser.email,
                actorRole: currentUser.role,
                timestamp: new Date().toISOString(),
                comments: `Automatically created and posted from an uploaded document.`
            }]
        };

        const result = await addPayment(paymentRecord);
         if (!result.success || !result.data) {
            throw new Error(result.error);
        }
        
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message };
    }
}

export async function getNextBillNumber() {
    return await getNextVendorBillNumber();
}
