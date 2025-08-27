

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { type Payment } from '@/app/finance/payment/schema';
import type { Role, Status } from './types';
import { type BankAccount } from '@/app/finance/banking/schema';

const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const bankAccountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const pettyCashFilePath = path.join(process.cwd(), 'src/app/finance/banking/petty-cash.json');

async function readData(filePath: string): Promise<any[]> {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeData(filePath: string, data: any[]) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


async function readPayments(): Promise<Payment[]> {
    return await readData(paymentsFilePath);
}
async function writePayments(data: Payment[]) {
    await writeData(paymentsFilePath, data);
}

async function readBankAccounts(): Promise<BankAccount[]> {
    return await readData(bankAccountsFilePath);
}
async function writeBankAccounts(data: BankAccount[]) {
    await writeData(bankAccountsFilePath, data);
}

async function readPettyCash(): Promise<{ balance: number }> {
    const data = await readData(pettyCashFilePath);
    // if file is empty or doesn't exist, return a default object
    if (!data || (Array.isArray(data) && data.length === 0)) {
        return { balance: 0 };
    }
    return data;
}

async function writePettyCash(data: { balance: number }) {
    await fs.writeFile(pettyCashFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function applyFinancialImpact(payment: Payment) {
    const { type, amount, bankAccountId, paymentFrom } = payment;
    if (paymentFrom === 'Petty Cash') {
        const pettyCash = await readPettyCash();
        if (type === 'Payment') {
            pettyCash.balance -= amount;
        } else { // Receipt
            pettyCash.balance += amount;
        }
        await writePettyCash(pettyCash);
    } else if (bankAccountId) {
        const allBankAccounts = await readBankAccounts();
        const accountIndex = allBankAccounts.findIndex(acc => acc.id === bankAccountId);
        if (accountIndex !== -1) {
            if (type === 'Payment') {
                allBankAccounts[accountIndex].balance -= amount;
            } else { // Receipt
                allBankAccounts[accountIndex].balance += amount;
            }
            await writeBankAccounts(allBankAccounts);
        }
    }
}


type WorkflowAction = 'SUBMIT' | 'APPROVE' | 'REJECT' | 'ADD_COMMENT';

const workflowActionSchema = z.object({
    transactionId: z.string(),
    actorId: z.string(),
    actorRole: z.string(),
    comment: z.string().optional(),
});


const performStateTransition = (transaction: Payment, action: WorkflowAction, currentUserRole: Role): Status => {
    let newStatus: Status = transaction.currentStatus || 'DRAFT';

    switch (action) {
        case 'SUBMIT':
            if (transaction.currentStatus === 'DRAFT' || transaction.currentStatus === 'REJECTED') {
                newStatus = 'PENDING_ADMIN_APPROVAL';
            }
            break;
        case 'APPROVE':
            if (transaction.currentStatus === 'PENDING_ADMIN_APPROVAL' && currentUserRole === 'Admin') {
                newStatus = 'PENDING_SUPER_ADMIN_APPROVAL';
            } else if (transaction.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL' && currentUserRole === 'Super Admin') {
                newStatus = 'POSTED';
            }
            break;
        case 'REJECT':
            if (transaction.currentStatus === 'PENDING_ADMIN_APPROVAL' && currentUserRole === 'Admin') {
                newStatus = 'REJECTED';
            } else if (transaction.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL' && currentUserRole === 'Super Admin') {
                newStatus = 'REJECTED';
            }
            break;
        default:
            break;
    }
    return newStatus;
};

const getHistoryActionText = (action: WorkflowAction, newStatus: Status, previousStatus: Status, role: Role): string => {
     switch (action) {
        case 'SUBMIT': return 'Submitted for Approval';
        case 'APPROVE':
            if (newStatus === 'POSTED') return 'Final Approval & Posted';
            return `Approved by ${role}`;
        case 'REJECT': return `Rejected by ${role}`;
        case 'ADD_COMMENT': return 'Comment Added';
        default: return 'Action Performed';
    }
}


async function updateTransactionWorkflow(
    transactionId: string,
    action: WorkflowAction,
    actorId: string,
    actorRole: Role,
    comment?: string
) {
    try {
        const allPayments = await readPayments();
        const transactionIndex = allPayments.findIndex(t => t.id === transactionId);

        if (transactionIndex === -1) {
            return { success: false, error: 'Transaction not found.' };
        }

        const transaction = allPayments[transactionIndex];
        const previousStatus = transaction.currentStatus || 'DRAFT';
        const newStatus = performStateTransition(transaction, action, actorRole);
        const historyActionText = getHistoryActionText(action, newStatus, previousStatus, actorRole);

        const newHistoryEntry = {
            action: historyActionText,
            actorId: actorId,
            actorRole: actorRole,
            timestamp: new Date().toISOString(),
            comments: comment || '',
        };
        
        allPayments[transactionIndex] = {
            ...transaction,
            currentStatus: newStatus,
            approvalHistory: [...(transaction.approvalHistory || []), newHistoryEntry],
        };
        
        // If the transaction is now posted, update the financial accounts
        if (newStatus === 'POSTED' && previousStatus !== 'POSTED') {
            await applyFinancialImpact(allPayments[transactionIndex]);
        }


        await writePayments(allPayments);
        revalidatePath('/workflow');
        revalidatePath('/finance/banking');
        revalidatePath('/finance/chart-of-accounts');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}


export async function submitTransaction(params: z.infer<typeof workflowActionSchema>) {
    const validation = workflowActionSchema.safeParse(params);
    if (!validation.success) return { success: false, error: "Invalid input" };
    const { transactionId, actorId, actorRole, comment } = validation.data;
    return await updateTransactionWorkflow(transactionId, 'SUBMIT', actorId, actorRole as Role, comment);
}

export async function approveTransaction(params: z.infer<typeof workflowActionSchema>) {
     const validation = workflowActionSchema.safeParse(params);
    if (!validation.success) return { success: false, error: "Invalid input" };
    const { transactionId, actorId, actorRole, comment } = validation.data;
    return await updateTransactionWorkflow(transactionId, 'APPROVE', actorId, actorRole as Role, comment);
}

export async function rejectTransaction(params: z.infer<typeof workflowActionSchema>) {
     const validation = workflowActionSchema.safeParse(params);
    if (!validation.success) return { success: false, error: "Invalid input" };
    const { transactionId, actorId, actorRole, comment } = validation.data;
    return await updateTransactionWorkflow(transactionId, 'REJECT', actorId, actorRole as Role, comment);
}

export async function addCommentToTransaction(params: z.infer<typeof workflowActionSchema>) {
    const validation = workflowActionSchema.safeParse(params);
    if (!validation.success) return { success: false, error: "Invalid input" };
    const { transactionId, actorId, actorRole, comment } = validation.data;
    return await updateTransactionWorkflow(transactionId, 'ADD_COMMENT', actorId, actorRole as Role, comment);
}
