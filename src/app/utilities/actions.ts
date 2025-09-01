

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { utilityAccountSchema, type UtilityAccount } from './schema';
import { addPayment, getNextPaymentVoucherNumber } from '../finance/payment/actions';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { getWorkflowSettings } from '@/app/admin/workflow-settings/actions';

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
        await recordBillPayment(savedAccount.id, billAmount, billDate, currentUser);
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

export async function recordBillPayment(accountId: string, amount: number, billDate: string, currentUser: UserRole) {
    const accounts = await readAccounts();
    const account = accounts.find(a => a.id === accountId);
    if (!account) {
        return { success: false, error: 'Utility account not found.' };
    }

    const workflowSettings = await getWorkflowSettings();
    const initialStatus = workflowSettings.approvalProcessEnabled ? 'DRAFT' : 'POSTED';
    
    // We call addPayment from the finance module which will handle creating the voucher
    // and applying financial impact upon final approval.
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
        currentStatus: initialStatus,
        property: account.propertyCode,
        unitCode: account.unitCode,
        utilityAccountId: account.id, // Link payment to utility account
        expenseAccountId: '5130', // Utilities expense account code
        approvalHistory: initialStatus === 'DRAFT' ? [] : [{
            action: 'Created & Auto-Posted',
            actorId: currentUser.email,
            actorRole: currentUser.role,
            timestamp: new Date().toISOString(),
            comments: 'Directly recorded utility transaction.'
        }]
    });

    if (paymentResult.success) {
        revalidatePath('/utilities');
        revalidatePath('/finance/payment');
        revalidatePath('/finance/workflow');
        return { success: true };
    } else {
        return { success: false, error: paymentResult.error || 'Failed to create payment voucher.' };
    }
}
