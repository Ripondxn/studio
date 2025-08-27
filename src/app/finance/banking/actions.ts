

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { bankAccountSchema, type BankAccount } from './schema';
import { type Payment, paymentSchema } from '../payment/schema';
import { type Cheque } from '../cheque-deposit/schema';
import { getWorkflowSettings } from '@/app/admin/workflow-settings/actions';
import { applyFinancialImpact } from '@/app/workflow/actions';


const accountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const pettyCashFilePath = path.join(process.cwd(), 'src/app/finance/banking/petty-cash.json');
const chequesFilePath = path.join(process.cwd(), 'src/app/finance/cheque-deposit/cheques-data.json');


async function readAccounts(): Promise<BankAccount[]> {
    try {
        await fs.access(accountsFilePath);
        const data = await fs.readFile(accountsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeAccounts([]);
            return [];
        }
        throw error;
    }
}

async function writeAccounts(data: BankAccount[]) {
    await fs.writeFile(accountsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function readPettyCash() {
    try {
        await fs.access(pettyCashFilePath);
        const data = await fs.readFile(pettyCashFilePath, 'utf-8');
        if (!data || (Array.isArray(data) && data.length === 0)) return { balance: 0 };
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { balance: 0 };
        }
        throw error;
    }
}

export async function writePettyCash(data: { balance: number }) {
    await fs.writeFile(pettyCashFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getBankAccounts() {
    const storedAccounts = await readAccounts();
    const pettyCashData = await readPettyCash();
    const pettyCashAccount: BankAccount = {
        id: "acc_3",
        accountName: "Petty Cash",
        bankName: "Cash on Hand",
        accountNumber: "N/A",
        balance: pettyCashData.balance,
        currency: "AED",
    };
    return [pettyCashAccount, ...storedAccounts];
}


const formSchema = bankAccountSchema.omit({ id: true });

export async function saveBankAccount(data: z.infer<typeof bankAccountSchema>, isNew: boolean) {
    const validation = bankAccountSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allAccounts = await readAccounts();
        
        if (isNew) {
            const newAccount: BankAccount = {
                ...validation.data,
                id: `acc_${Date.now()}`,
            };
            allAccounts.push(newAccount);
        } else {
            const index = allAccounts.findIndex(acc => acc.id === data.id);
            if (index === -1) {
                return { success: false, error: 'Account not found.' };
            }
            allAccounts[index] = validation.data;
        }

        await writeAccounts(allAccounts);
        revalidatePath('/finance/banking');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function deleteBankAccount(accountId: string) {
     try {
        if (accountId === 'acc_3') {
            return { success: true }; // Silently succeed for petty cash
        }
        
        const allAccounts = await readAccounts();
        const updatedAccounts = allAccounts.filter(acc => acc.id !== accountId);
        
        if (allAccounts.length === updatedAccounts.length) {
            return { success: false, error: 'Account not found.' };
        }

        await writeAccounts(updatedAccounts);
        revalidatePath('/finance/banking');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

async function readAllPayments(): Promise<Payment[]> {
    try {
        const paymentsData = await fs.readFile(paymentsFilePath, 'utf-8');
        return JSON.parse(paymentsData);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error('Failed to read payments file:', error);
        return [];
    }
}

async function writePayments(data: Payment[]) {
    await fs.writeFile(paymentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


async function readAllCheques(): Promise<Cheque[]> {
    try {
        const chequesData = await fs.readFile(chequesFilePath, 'utf-8');
        return JSON.parse(chequesData);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error('Failed to read cheques file:', error);
        return [];
    }
}


export async function getAllTransactions(): Promise<Payment[]> {
    const payments = await readAllPayments();
    
    const allTransactions = [...payments].filter(p => p.currentStatus === 'POSTED');

    return allTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getTransactionsForAccount(accountId: string): Promise<Payment[]> {
     try {
        const allTransactions = await readAllPayments();
        
        const accountPayments = allTransactions.filter((p: Payment) => {
            if (p.currentStatus !== 'POSTED') return false; // Only show posted transactions
            
            if (accountId === 'acc_3') { // Petty Cash account
                return p.paymentFrom === 'Petty Cash';
            }
            return p.bankAccountId === accountId;
        });

        return accountPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error('Failed to read payments file:', error);
        return [];
    }
}

const fundTransferSchema = z.object({
    fromAccountId: z.string().min(1, "From account is required."),
    toAccountId: z.string().min(1, "To account is required."),
    amount: z.number().min(0.01, "Amount must be positive."),
    date: z.string().min(1, "Date is required."),
    remarks: z.string().optional(),
});


export async function transferFunds(data: z.infer<typeof fundTransferSchema>) {
    const validation = fundTransferSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    const { fromAccountId, toAccountId, amount, date, remarks } = validation.data;

    if (fromAccountId === toAccountId) {
        return { success: false, error: "From and To accounts cannot be the same." };
    }
    
    try {
        const workflowSettings = await getWorkflowSettings();
        const initialStatus = workflowSettings.approvalProcessEnabled ? 'DRAFT' : 'POSTED';

        if (initialStatus === 'POSTED') {
            // If direct posting, do the balance update. Otherwise, it happens on final approval.
            const allAccounts = await readAccounts();
            const pettyCash = await readPettyCash();
            
            const fromAccount = fromAccountId === 'acc_3' ? { ...pettyCash, id: 'acc_3', accountName: 'Petty Cash' } : allAccounts.find(acc => acc.id === fromAccountId);
            const toAccount = toAccountId === 'acc_3' ? { ...pettyCash, id: 'acc_3', accountName: 'Petty Cash' } : allAccounts.find(acc => acc.id === toAccountId);

            if (!fromAccount || !toAccount) {
                return { success: false, error: "One or both accounts not found." };
            }
            
            if(fromAccount.balance < amount) {
                return { success: false, error: `Insufficient funds in ${fromAccount.accountName}.` };
            }

            if (fromAccountId === 'acc_3') {
                pettyCash.balance -= amount;
            } else {
                const fromIndex = allAccounts.findIndex(acc => acc.id === fromAccountId);
                allAccounts[fromIndex].balance -= amount;
            }
            
            if (toAccountId === 'acc_3') {
                pettyCash.balance += amount;
            } else {
                const toIndex = allAccounts.findIndex(acc => acc.id === toAccountId);
                allAccounts[toIndex].balance += amount;
            }
            
            await writeAccounts(allAccounts);
            await writePettyCash(pettyCash);
        }

        // Create payment records regardless of workflow status
        const allPayments = await readAllPayments();
        const referenceNo = `TRF-${Date.now()}`;
        const fromAccountName = fromAccountId === 'acc_3' ? 'Petty Cash' : (await readAccounts()).find(a => a.id === fromAccountId)?.accountName || 'Bank';
        const toAccountName = toAccountId === 'acc_3' ? 'Petty Cash' : (await readAccounts()).find(a => a.id === toAccountId)?.accountName || 'Bank';
        
        const paymentRecord: Payment = {
            id: `PAY-${Date.now()}-OUT`,
            type: 'Payment',
            date: date,
            partyType: 'Vendor', // Internal Transfer
            partyName: `Transfer to ${toAccountName}`,
            amount: amount,
            paymentMethod: fromAccountId === 'acc_3' ? 'Cash' : 'Bank Transfer',
            bankAccountId: fromAccountId,
            paymentFrom: fromAccountId === 'acc_3' ? 'Petty Cash' : 'Bank',
            referenceNo,
            remarks,
            status: 'Paid',
            currentStatus: initialStatus,
        };

         const receiptRecord: Payment = {
            id: `PAY-${Date.now()}-IN`,
            type: 'Receipt',
            date: date,
            partyType: 'Customer', // Internal Transfer
            partyName: `Transfer from ${fromAccountName}`,
            amount: amount,
            paymentMethod: toAccountId === 'acc_3' ? 'Cash' : 'Bank Transfer',
            bankAccountId: toAccountId,
            paymentFrom: toAccountId === 'acc_3' ? 'Petty Cash' : 'Bank',
            referenceNo,
            remarks,
            status: 'Received',
            currentStatus: initialStatus,
        };
        
        allPayments.push(paymentRecord, receiptRecord);
        await writePayments(allPayments);

        revalidatePath('/finance/banking');
        revalidatePath('/workflow');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
