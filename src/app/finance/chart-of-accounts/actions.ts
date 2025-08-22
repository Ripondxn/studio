
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { accountSchema, type Account } from './schema';
import { type BankAccount } from '../banking/schema';

const accountsFilePath = path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json');
const bankAccountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const pettyCashFilePath = path.join(process.cwd(), 'src/app/finance/banking/petty-cash.json');


async function readBankAccounts(): Promise<BankAccount[]> {
    try {
        await fs.access(bankAccountsFilePath);
        const data = await fs.readFile(bankAccountsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function readPettyCash() {
    try {
        await fs.access(pettyCashFilePath);
        const data = await fs.readFile(pettyCashFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { balance: 0 };
        }
        throw error;
    }
}


async function readAccounts(): Promise<Account[]> {
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

async function writeAccounts(data: Account[]) {
    await fs.writeFile(accountsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAccounts() {
    const accounts = await readAccounts();
    const bankAccounts = await readBankAccounts();
    const pettyCash = await readPettyCash();

    const totalBankBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalCashAndBank = totalBankBalance + (pettyCash.balance || 0);
    
    // Find the 'Cash and Bank' account and update its balance
    const cashAndBankAccount = accounts.find(acc => acc.code === '1110');
    if (cashAndBankAccount) {
        cashAndBankAccount.balance = totalCashAndBank;
    }
    
    // Recalculate parent balances
    const accountMap = new Map(accounts.map(acc => [acc.code, { ...acc, children: [] as Account[] }]));

    accounts.forEach(acc => {
        if (acc.parentCode && accountMap.has(acc.parentCode)) {
            accountMap.get(acc.parentCode)!.children.push(acc);
        }
    });

    const recalculateBalances = (accountCode: string) => {
        const account = accountMap.get(accountCode);
        if (!account || !account.isGroup) {
            return account?.balance || 0;
        }

        let sum = 0;
        account.children.forEach(child => {
            sum += recalculateBalances(child.code);
        });
        account.balance = sum;
        return sum;
    }
    
    // Recalculate starting from the root nodes (those without parents)
    accounts.forEach(acc => {
        if(!acc.parentCode) {
            recalculateBalances(acc.code);
        }
    })

    return Array.from(accountMap.values());
}

const addAccountFormSchema = accountSchema.omit({ balance: true }).extend({
    balance: z.number().optional().default(0),
});

export async function addAccount(data: z.infer<typeof addAccountFormSchema>) {
    const validation = addAccountFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allAccounts = await readAccounts();
        const accountExists = allAccounts.some(acc => acc.code === data.code);
        if (accountExists) {
            return { success: false, error: `Account with code "${data.code}" already exists.` };
        }

        const newAccount: Account = validation.data;

        allAccounts.push(newAccount);
        await writeAccounts(allAccounts);
        
        revalidatePath('/finance/chart-of-accounts');
        return { success: true, data: newAccount };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
