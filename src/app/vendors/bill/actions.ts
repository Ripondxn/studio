
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { billSchema, type Bill } from './schema';

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

export async function saveBill(data: Omit<Bill, 'id' | 'amountPaid'> & { id?: string }) {
    const validation = billSchema.omit({id: true, amountPaid: true, remainingBalance: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allBills = await readBills();
        const isNew = !data.id;

        if (isNew) {
             let maxNum = 0;
            allBills.forEach(i => {
                const match = i.billNo.match(/^BILL-(\d+)$/);
                if (match) {
                    const num = parseInt(match[1], 10);
                    if (num > maxNum) {
                        maxNum = num;
                    }
                }
            });
            const newBillNo = `BILL-${(maxNum + 1).toString().padStart(4, '0')}`;

            const newBill: Bill = {
                ...validation.data,
                id: `BILL-${Date.now()}`,
                billNo: newBillNo,
                amountPaid: 0,
            };
            allBills.push(newBill);
        } else {
            const index = allBills.findIndex(bill => bill.id === data.id);
            if (index === -1) {
                return { success: false, error: 'Bill not found.' };
            }
            allBills[index] = { ...allBills[index], ...validation.data };
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
