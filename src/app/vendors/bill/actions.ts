

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { billSchema, type Bill } from './schema';
import { isBefore, parseISO } from 'date-fns';

const billsFilePath = path.join(process.cwd(), 'src/app/vendors/bill/bills-data.json');

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

            const newBill: Bill = {
                ...validatedData,
                billNo: newBillNo,
                id: `BILL-${Date.now()}`,
                amountPaid: 0,
            };
            allBills.push(newBill);
        } else {
            const index = allBills.findIndex(bill => bill.id === data.id);
            if (index === -1) {
                return { success: false, error: 'Bill not found.' };
            }
            allBills[index] = { ...allBills[index], ...validatedData };
        }

        await writeBills(allBills);
        revalidatePath(`/vendors/add?code=${data.vendorCode}`);
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
