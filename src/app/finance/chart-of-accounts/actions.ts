
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { accountSchema, type Account } from './schema';
import { type BankAccount } from '../banking/schema';
import { type Payment } from '../payment/schema';

const accountsFilePath = path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json');
const bankAccountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const pettyCashFilePath = path.join(process.cwd(), 'src/app/finance/banking/petty-cash.json');
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


async function writeAccounts(data: Account[]) {
    await fs.writeFile(accountsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAccounts(): Promise<Account[]> {
    const accounts: Account[] = await readData(accountsFilePath);
    const bankAccounts: BankAccount[] = await readData(bankAccountsFilePath);
    const pettyCash: { balance: number } = await readData(pettyCashFilePath) || { balance: 0 };
    const payments: Payment[] = await readData(paymentsFilePath);

    // Create a map for easy access and modification
    const accountMap = new Map<string, Account>(accounts.map(acc => [acc.code, { ...acc, balance: acc.isGroup ? 0 : acc.balance, children: [] as Account[] }]));

    // 1. Reset all non-group account balances that are calculated dynamically
    const dynamicAccountCodes = ['1110', '4100', '5110', '5120', '5130', '5140'];
    dynamicAccountCodes.forEach(code => {
        if(accountMap.has(code) && !accountMap.get(code)!.isGroup) {
            accountMap.get(code)!.balance = 0;
        }
    });

    // 2. Calculate Cash and Bank from bank accounts and petty cash
    const totalBankBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalCashAndBank = totalBankBalance + (pettyCash.balance || 0);
    if (accountMap.has('1110')) {
        accountMap.get('1110')!.balance = totalCashAndBank;
    }

    // 3. Aggregate payments into expense and revenue accounts
    payments.forEach(payment => {
        if (payment.type === 'Payment') {
            if (payment.agentCode) { // Agent Fee
                if (accountMap.has('5140')) {
                    accountMap.get('5140')!.balance += payment.amount;
                }
            } else if (payment.partyType === 'Vendor') { // Generic vendor payment, assume maintenance for now
                 if (accountMap.has('5110')) {
                    accountMap.get('5110')!.balance += payment.amount;
                }
            }
             // Other payment types could be routed here, e.g. to utilities '5120'
        } else if (payment.type === 'Receipt') { // Rental Income
            if (accountMap.has('4100')) {
                accountMap.get('4100')!.balance += payment.amount;
            }
        }
    });
    
    // Build tree structure for balance recalculation
    const rootAccounts: Account[] = [];
    accountMap.forEach(acc => {
        if (acc.parentCode && accountMap.has(acc.parentCode)) {
            // @ts-ignore
            accountMap.get(acc.parentCode)!.children.push(acc);
        } else {
            rootAccounts.push(acc);
        }
    });

    // 4. Recalculate parent balances from the bottom up
    const recalculateBalances = (account: Account): number => {
        if (!account.isGroup) {
            return account.balance;
        }
        // @ts-ignore
        const children = account.children || [];
        const sum = children.reduce((acc, child) => acc + recalculateBalances(accountMap.get(child.code)!), 0);
        account.balance = sum;
        return sum;
    }
    
    rootAccounts.forEach(recalculateBalances);

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
        const allAccounts = await readData(accountsFilePath);
        const accountExists = allAccounts.some((acc: Account) => acc.code === data.code);
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
