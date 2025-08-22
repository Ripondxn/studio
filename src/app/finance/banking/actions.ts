
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { bankAccountSchema, type BankAccount } from './schema';
import { type Payment } from '../payment/schema';


const accountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const pettyCashFilePath = path.join(process.cwd(), 'src/app/finance/banking/petty-cash.json');


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

async function readPettyCash() {
    try {
        await fs.access(pettyCashFilePath);
        const data = await fs.readFile(pettyCashFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { balance: 55000 };
        }
        throw error;
    }
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
     if (accountId === 'acc_3') {
        return { success: false, error: 'The Petty Cash account cannot be deleted.' };
     }
     try {
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

export async function getTransactionsForAccount(accountId: string): Promise<Payment[]> {
     try {
        const paymentsData = await fs.readFile(paymentsFilePath, 'utf-8');
        const allPayments: Payment[] = JSON.parse(paymentsData);
        
        const accountPayments = allPayments.filter((p: Payment) => {
             if (accountId === 'acc_3') {
                return p.paymentMethod === 'Cash';
            }
            return p.bankAccountId === accountId
        });

        return accountPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error('Failed to read payments file:', error);
        return [];
    }
}

    
