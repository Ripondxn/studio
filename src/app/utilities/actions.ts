

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { utilityAccountSchema, type UtilityAccount } from './schema';
import { type Payment } from '../finance/payment/schema';
import { type UserRole } from '../admin/user-roles/schema';
import { saveBill } from '../vendors/bill/actions';

const accountsFilePath = path.join(process.cwd(), 'src/app/utilities/accounts-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');

async function readAccounts(): Promise<UtilityAccount[]> {
    try {
        await fs.access(accountsFilePath);
        const data = await fs.readFile(accountsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(accountsFilePath, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
        throw error;
    }
}

async function writeAccounts(data: UtilityAccount[]) {
    await fs.writeFile(accountsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readPayments() {
     try {
        const data = await fs.readFile(paymentsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export async function getAccounts(): Promise<UtilityAccount[]> {
    const accounts = await readAccounts();
    const payments = await readPayments();

    const paymentMap = new Map<string, number>();
    payments.forEach((p: any) => {
        if (p.utilityAccountId && p.currentStatus === 'POSTED') {
            const currentTotal = paymentMap.get(p.utilityAccountId) || 0;
            paymentMap.set(p.utilityAccountId, currentTotal + p.amount);
        }
    });

    return accounts.map(acc => ({
        ...acc,
        totalPaid: paymentMap.get(acc.id) || 0,
    }));
}

export async function saveUtilityAccount(
    data: Omit<UtilityAccount, 'id'|'totalPaid'> & { id?: string, billAmount?: number, billDate?: string, recordFirstBill?: boolean }, 
    currentUser: UserRole
) {
    const validationSchema = utilityAccountSchema.omit({ id: true, totalPaid: true }).extend({
        billAmount: z.coerce.number().optional(),
        billDate: z.string().optional(),
        recordFirstBill: z.boolean().optional(),
    });

    const validation = validationSchema.safeParse(data);
    if (!validation.success) {
        console.error("Validation Error:", validation.error.format());
        return { success: false, error: 'Invalid data format.' };
    }

    const allAccounts = await readAccounts();
    const { recordFirstBill, billAmount, billDate, ...validatedData } = validation.data;
    let savedAccount: UtilityAccount;

    if (data.id) { // Update
        const index = allAccounts.findIndex(a => a.id === data.id);
        if (index === -1) return { success: false, error: 'Account not found.' };
        allAccounts[index] = { ...allAccounts[index], ...validatedData };
        savedAccount = allAccounts[index];
    } else { // Create
        const newAccount: UtilityAccount = { ...validatedData, id: `UTIL-${Date.now()}` };
        allAccounts.push(newAccount);
        savedAccount = newAccount;
    }
    await writeAccounts(allAccounts);

    // If an initial bill is included, record it.
    if (recordFirstBill && billAmount && billAmount > 0 && billDate) {
        await recordBillForAccount({
            accountId: savedAccount.id,
            amount: billAmount,
            billDate: billDate,
            dueDate: billDate,
            billNo: `BILL-${savedAccount.accountNumber}-${billDate}`,
            notes: 'Initial bill recorded with account creation.'
        });
    }

    revalidatePath('/utilities');
    return { success: true };
}

export async function deleteUtilityAccount(id: string) {
    const allAccounts = await readAccounts();
    const updatedAccounts = allAccounts.filter(a => a.id !== id);
    if (allAccounts.length === updatedAccounts.length) {
        return { success: false, error: 'Account not found.' };
    }
    await writeAccounts(updatedAccounts);
    revalidatePath('/utilities');
    return { success: true };
}

export async function recordBillForAccount(data: { accountId: string; amount: number; billDate: string; dueDate?: string; billNo: string; notes?: string }) {
    const accounts = await readAccounts();
    const account = accounts.find(a => a.id === data.accountId);
    if (!account) {
        return { success: false, error: 'Utility account not found.' };
    }

    if (!account.vendorCode) {
        return { success: false, error: `Utility account is not linked to a vendor. Please edit the account to link a vendor first.`};
    }
    
    const billData = {
      vendorCode: account.vendorCode,
      vendorName: account.provider,
      billNo: data.billNo,
      billDate: data.billDate,
      dueDate: data.dueDate || data.billDate,
      status: 'Sent' as const,
      property: account.propertyCode,
      unitCode: account.unitCode,
      utilityAccountId: account.id, // Pass the utility account ID here
      notes: data.notes,
      items: [{
          id: `item-${Date.now()}`,
          description: `${account.utilityType} bill for account ${account.accountNumber}`,
          quantity: 1,
          unitPrice: data.amount,
          total: data.amount,
          expenseAccountId: '5130' // Utilities
      }],
      subTotal: data.amount,
      tax: 0,
      total: data.amount
    };

    const result = await saveBill(billData, false, false);

    if (result.success) {
        revalidatePath('/utilities');
        revalidatePath('/vendors/add');
        revalidatePath('/vendors');
        return { success: true };
    } else {
        return { success: false, error: result.error || 'Failed to create bill.' };
    }
}
