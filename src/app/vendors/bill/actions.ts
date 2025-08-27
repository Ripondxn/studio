

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { billSchema, type Bill } from './schema';
import { isBefore, parseISO } from 'date-fns';
import { type Payment } from '@/app/finance/payment/schema';
import { getContractLookups } from '@/app/tenancy/contract/actions';
import { getOpenTickets } from '@/app/maintenance/ticket-issue/actions';
import { getExpenseAccounts } from '@/app/finance/chart-of-accounts/actions';
import { getProducts } from '@/app/products/actions';
import { getWorkflowSettings } from '@/app/admin/workflow-settings/actions';
import { applyFinancialImpact } from '@/app/workflow/actions';

const billsFilePath = path.join(process.cwd(), 'src/app/vendors/bill/bills-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');

async function readBills(): Promise<Bill[]> {
    try {
        await fs.access(billsFilePath);
        const data = await fs.readFile(billsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeBills([]);
            return [];
        }
        throw error;
    }
}

async function writeBills(data: Bill[]) {
    await fs.writeFile(billsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getBillsForVendor(vendorCode: string) {
    const allBills = await readBills();
    const vendorBills = allBills.filter(bill => bill.vendorCode === vendorCode);
    return vendorBills.map(bill => ({
        ...bill,
        remainingBalance: bill.total - (bill.amountPaid || 0),
    }));
}

export async function getNextBillNumber() {
    const allBills = await readBills();
    let maxNum = 0;
    allBills.forEach(i => {
        const match = i.billNo.match(/^BL-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `BL-${(maxNum + 1).toString().padStart(4, '0')}`;
}

export async function getBillLookups() {
    const [contractLookups, openTickets, expenseAccounts, products] = await Promise.all([
        getContractLookups(),
        getOpenTickets(),
        getExpenseAccounts(),
        getProducts()
    ]);
    return {
        properties: contractLookups.properties,
        maintenanceTickets: openTickets,
        expenseAccounts,
        products
    }
}


export async function saveBill(data: Omit<Bill, 'id' | 'amountPaid'> & { id?: string, isAutoBillNo?: boolean }) {
    const { isAutoBillNo, ...billData } = data;
    const validation = billSchema.omit({id: true, amountPaid: true, remainingBalance: true}).safeParse(billData);

    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allBills = await readBills();
        const isNew = !data.id;
        const validatedData = validation.data;
        const workflowSettings = await getWorkflowSettings();
        const initialStatus = workflowSettings.approvalProcessEnabled ? 'DRAFT' : 'POSTED';

        if (isNew) {
            let newBillNo = validatedData.billNo;
            if (isAutoBillNo || !newBillNo) {
                 newBillNo = await getNextBillNumber();
            } else {
                const billExists = allBills.some(bill => bill.billNo === newBillNo);
                if (billExists) {
                    return { success: false, error: `A bill with number "${newBillNo}" already exists.`};
                }
            }
            const newBillId = `BILL-${Date.now()}`;
            const newBill: Bill = {
                ...validatedData,
                billNo: newBillNo,
                id: newBillId,
                amountPaid: 0,
            };
            allBills.push(newBill);
             const newPayment: Omit<Payment, 'id'> = {
                type: 'Payment',
                date: validatedData.billDate,
                partyType: 'Vendor',
                partyName: validatedData.vendorCode,
                amount: validatedData.total,
                paymentMethod: 'Bank Transfer', 
                paymentFrom: 'Bank',
                referenceNo: validatedData.billNo,
                property: validatedData.property,
                unitCode: validatedData.unitCode,
                roomCode: validatedData.roomCode,
                description: `Payment for Bill #${validatedData.billNo}`,
                status: 'Paid',
                currentStatus: initialStatus,
                billAllocations: [{ billId: newBillId, amount: validatedData.total }]
            };
            
            if(initialStatus === 'POSTED') await applyFinancialImpact(newPayment as Payment);

            const allPayments = await fs.readFile(paymentsFilePath, 'utf-8').then(JSON.parse).catch(() => []);
            allPayments.push({...newPayment, id: `PAY-${Date.now()}`});
            await fs.writeFile(paymentsFilePath, JSON.stringify(allPayments, null, 2), 'utf-8');
        } else {
            const index = allBills.findIndex(bill => bill.id === data.id);
            if (index === -1) {
                return { success: false, error: 'Bill not found.' };
            }
            allBills[index] = { ...allBills[index], ...validatedData };
        }
        
        await writeBills(allBills);
        revalidatePath(`/vendors/add?code=${data.vendorCode}`);
        revalidatePath('/workflow');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function deleteBill(billId: string) {
    try {
        const allBills = await readBills();
        const billToDelete = allBills.find(bill => bill.id === billId);
        if (!billToDelete) {
             return { success: false, error: 'Bill not found.' };
        }

        const updatedBills = allBills.filter(bill => bill.id !== billId);
        await writeBills(updatedBills);
        revalidatePath(`/vendors/add?code=${billToDelete.vendorCode}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function applyPaymentToBills(billPayments: { billId: string; amount: number }[], vendorCode: string) {
    try {
        const allBills = await readBills();

        for (const payment of billPayments) {
            const index = allBills.findIndex(b => b.id === payment.billId);
            if (index !== -1) {
                allBills[index].amountPaid = (allBills[index].amountPaid || 0) + payment.amount;
                const remainingBalance = allBills[index].total - allBills[index].amountPaid;
                
                if (remainingBalance <= 0.001) {
                    allBills[index].status = 'Paid';
                } else if (allBills[index].status === 'Draft' || allBills[index].status === 'Overdue') {
                    allBills[index].status = 'Sent';
                }
            }
        }

        await writeBills(allBills);
        revalidatePath(`/vendors/add?code=${vendorCode}`);
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
