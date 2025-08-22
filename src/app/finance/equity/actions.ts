
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { readPettyCash, writePettyCash } from '@/app/finance/banking/actions';
import { promises as fs } from 'fs';
import path from 'path';
import { type BankAccount } from '@/app/finance/banking/schema';

const accountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const equityTransactionsFilePath = path.join(process.cwd(), 'src/app/finance/equity/transactions.json');

async function readAccounts(): Promise<BankAccount[]> {
    try {
        const data = await fs.readFile(accountsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeAccounts(data: BankAccount[]) {
    await fs.writeFile(accountsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readEquityTransactions() {
    try {
        await fs.access(equityTransactionsFilePath);
        const data = await fs.readFile(equityTransactionsFilePath, 'utf-8');
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
    
    const { type, amount, accountId } = validation.data;

    try {
        if (accountId === 'acc_3') { // Petty Cash
            const pettyCash = await readPettyCash();
            if (type === 'Contribution') {
                pettyCash.balance += amount;
            } else { // Withdrawal
                if (pettyCash.balance < amount) {
                    return { success: false, error: 'Insufficient funds in Petty Cash.' };
                }
                pettyCash.balance -= amount;
            }
            await writePettyCash(pettyCash);
        } else { // Bank Account
            const allBankAccounts = await readAccounts();
            const bankAccountIndex = allBankAccounts.findIndex(acc => acc.id === accountId);
            
            if(bankAccountIndex === -1) {
                return { success: false, error: 'Bank account not found.' };
            }

            if (type === 'Contribution') {
                 allBankAccounts[bankAccountIndex].balance += amount;
            } else { // Withdrawal
                 if (allBankAccounts[bankAccountIndex].balance < amount) {
                    return { success: false, error: 'Insufficient funds in the selected bank account.' };
                }
                allBankAccounts[bankAccountIndex].balance -= amount;
            }
            await writeAccounts(allBankAccounts);
        }
        
        // Log the equity transaction to be reflected in the Chart of Accounts
        const allEquityTransactions = await readEquityTransactions();
        const newTransaction = {
            id: `EQT-${Date.now()}`,
            ...validation.data
        };
        allEquityTransactions.push(newTransaction);
        await writeEquityTransactions(allEquityTransactions);

        revalidatePath('/finance/banking');
        revalidatePath('/finance/chart-of-accounts');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
