

'use server';

import { processDocument, type ProcessDocumentInput } from '@/ai/flows/process-document-flow';
import { getAllVendors } from '@/app/vendors/actions';
import { getAllTenants } from '@/app/tenancy/tenants/actions';
import { getAllCustomers } from '@/app/tenancy/customer/actions';
import { saveBill } from '../vendors/bill/actions';
import { saveInvoice } from '../tenancy/customer/invoice/actions';
import { type UserRole } from '../admin/user-roles/schema';
import { addPayment } from '../finance/payment/actions';
import { promises as fs } from 'fs';
import path from 'path';
import { applyFinancialImpact } from '../workflow/actions';


export async function extractDataFromDocument(input: ProcessDocumentInput) {
  try {
    const result = await processDocument(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error processing document:', error);
    return { success: false, error: 'Failed to process document with AI.' };
  }
}

export async function getPartyLookups() {
    const [vendors, tenants, customers] = await Promise.all([
        getAllVendors(),
        getAllTenants(),
        getAllCustomers(),
    ]);

    return {
        vendors: vendors.map((v: any) => ({ value: v.code, label: v.name })),
        tenants: tenants.map((t: any) => ({ value: t.code, label: t.name })),
        customers: customers.map((c: any) => ({ value: c.code, label: c.name })),
    };
}

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


export async function createBillFromDocument(data: any, currentUser: UserRole) {
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
            status: 'Paid',
        };
        
        const billResult = await saveBill(billData, true, false); 
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
        
        // Apply financial impact since we are bypassing the normal workflow
        await applyFinancialImpact(paymentResult.data);

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
            // Assign a default expense account for direct posting
            expenseAccountId: '4110', // Rental Income
        };

        const result = await saveInvoice(invoiceData, currentUser.name);
        if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to save invoice from document.');
        }
        
        const savedInvoice = result.data;

        // Now, create and post the associated payment record
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
        
        // Apply financial impact since we are bypassing the normal workflow
        await applyFinancialImpact(paymentResult.data);

        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function createReceiptFromDocument(data: any, currentUser: {name: string, email: string, role: UserRole['role']}) {
    try {
         const paymentRecord = {
            ...data,
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
        
        // Apply financial impact since we are bypassing the normal workflow
        await applyFinancialImpact(result.data);

        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message };
    }
}
