

'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';
import { getWorkflowSettings } from '@/app/admin/workflow-settings/actions';
import { type Payment } from '@/app/finance/payment/schema';
import { applyFinancialImpact } from '@/app/workflow/actions';

const equityTransactionsFilePath = path.join(process.cwd(), 'src/app/finance/equity/transactions.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');


async function readData(filePath: string) {
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

async function writeEquityTransactions(data: any[]) {
    await fs.writeFile(equityTransactionsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readPayments(): Promise<Payment[]> {
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
async function writePayments(data: Payment[]) {
    await fs.writeFile(paymentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}



const equitySchema = z.object({
    type: z.enum(['Contribution', 'Withdrawal']),
    amount: z.number().min(0.01, 'Amount must be positive'),
    date: z.string().min(1, 'Date is required'),
    accountId: z.string().min(1, 'Account is required'),
    remarks: z.string().optional(),
});


export async function recordEquityTransaction(data: z.infer<typeof equitySchema>) {
    const validation = equitySchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const { type, amount, date, accountId, remarks } = validation.data;

    try {
        const workflowSettings = await getWorkflowSettings();
        const initialStatus = workflowSettings.approvalProcessEnabled ? 'DRAFT' : 'POSTED';

        const paymentRecord: Payment = {
            id: `EQT-${Date.now()}`,
            type: type === 'Contribution' ? 'Receipt' : 'Payment',
            date,
            partyType: 'Customer', // Simplified for internal transaction
            partyName: 'Owner',
            amount,
            paymentMethod: accountId === 'acc_3' ? 'Cash' : 'Bank Transfer',
            bankAccountId: accountId,
            paymentFrom: accountId === 'acc_3' ? 'Petty Cash' : 'Bank',
            referenceNo: 'Equity Transaction',
            remarks,
            status: type === 'Contribution' ? 'Received' : 'Paid',
            currentStatus: initialStatus
        };

        if (initialStatus === 'POSTED') {
            await applyFinancialImpact(paymentRecord);
        }
        
        // Log the equity transaction to be reflected in the Chart of Accounts
        const allEquityTransactions = await readData(equityTransactionsFilePath);
        const newTransaction = {
            id: paymentRecord.id,
            ...validation.data
        };
        allEquityTransactions.push(newTransaction);
        await writeEquityTransactions(allEquityTransactions);
        
        // Also create a payment record for the workflow
        const allPayments = await readPayments();
        allPayments.push(paymentRecord);
        await writePayments(allPayments);


        revalidatePath('/finance/banking');
        revalidatePath('/finance/chart-of-accounts');
        revalidatePath('/workflow');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function deleteEquityTransaction(transactionId: string) {
    try {
        const allEquityTransactions = await readData(equityTransactionsFilePath);
        const transactionIndex = allEquityTransactions.findIndex(t => t.id === transactionId);

        if (transactionIndex === -1) {
            return { success: false, error: 'Equity transaction not found.' };
        }

        const transactionToDelete = allEquityTransactions[transactionIndex];
        const { type, amount, accountId } = transactionToDelete;

        // Reverse the financial impact
        const reversalPayment = {
            type: type === 'Contribution' ? 'Payment' : 'Receipt',
            amount,
            bankAccountId: accountId,
            paymentFrom: accountId === 'acc_3' ? 'Petty Cash' : 'Bank',
        }
        await applyFinancialImpact(reversalPayment as Payment);

        // Remove the transaction from the log
        const updatedTransactions = allEquityTransactions.filter(t => t.id !== transactionId);
        await writeEquityTransactions(updatedTransactions);
        
         // Also remove the corresponding payment record
        const allPayments = await readPayments();
        const updatedPayments = allPayments.filter(p => p.id !== transactionId);
        await writePayments(updatedPayments);

        revalidatePath('/finance/banking');
        revalidatePath('/finance/chart-of-accounts');
        revalidatePath('/workflow');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
