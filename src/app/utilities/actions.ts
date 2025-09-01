
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { utilityAccountSchema, type UtilityAccount } from './schema';
import { addPayment } from '@/app/finance/payment/actions';
import { type UserRole } from '@/app/admin/user-roles/schema';

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

export async function getAllUtilityAccounts(): Promise<UtilityAccount[]> {
    const accounts = await readAccounts();
    const payments = await readPayments();

    const paymentMap = new Map<string, number>();
    payments.forEach((p: any) => {
        if (p.utilityAccountId) {
            const currentTotal = paymentMap.get(p.utilityAccountId) || 0;
            paymentMap.set(p.utilityAccountId, currentTotal + p.amount);
        }
    });

    return accounts.map(acc => ({
        ...acc,
        totalPaid: paymentMap.get(acc.id) || 0,
    }));
}

export async function saveUtilityAccount(data: Omit<UtilityAccount, 'id'|'totalPaid'> & { id?: string }) {
    const validation = utilityAccountSchema.omit({ id: true, totalPaid: true }).safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    const allAccounts = await readAccounts();
    if (data.id) { // Update
        const index = allAccounts.findIndex(a => a.id === data.id);
        if (index === -1) return { success: false, error: 'Account not found.' };
        allAccounts[index] = { ...allAccounts[index], ...validation.data };
    } else { // Create
        const newAccount: UtilityAccount = { ...validation.data, id: `UTIL-${Date.now()}` };
        allAccounts.push(newAccount);
    }
    await writeAccounts(allAccounts);
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

export async function recordBillPayment(accountId: string, amount: number, billDate: string, currentUser: UserRole) {
    const accounts = await readAccounts();
    const account = accounts.find(a => a.id === accountId);
    if (!account) {
        return { success: false, error: 'Utility account not found.' };
    }

    const paymentResult = await addPayment({
        type: 'Payment',
        date: billDate,
        partyType: 'Vendor',
        partyName: account.provider,
        amount: amount,
        paymentMethod: 'Bank Transfer',
        paymentFrom: 'Bank',
        description: `Payment for ${account.utilityType} - Acc# ${account.accountNumber}`,
        remarks: `Utility bill payment for ${account.propertyCode}`,
        status: 'Paid',
        createdByUser: currentUser.name,
        currentStatus: 'POSTED',
        property: account.propertyCode,
        unitCode: account.unitCode,
        expenseAccountId: '5130' // Utilities expense account code
    });

    if (paymentResult.success) {
        revalidatePath('/utilities');
        revalidatePath('/finance/payment');
        revalidatePath('/finance/banking');
        revalidatePath('/finance/chart-of-accounts');
        return { success: true };
    } else {
        return { success: false, error: paymentResult.error || 'Failed to create payment voucher.' };
    }
}
