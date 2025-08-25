

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
const equityTransactionsFilePath = path.join(process.cwd(), 'src/app/finance/equity/transactions.json');


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
    const pettyCash: { balance: number } = (await readData(pettyCashFilePath)) || { balance: 0 };
    const payments: Payment[] = await readData(paymentsFilePath);
    const equityTransactions: any[] = await readData(equityTransactionsFilePath);

    // Create a map for easy access and modification
    const accountMap = new Map<string, Account>(accounts.map(acc => [acc.code, { ...acc, balance: acc.isGroup ? 0 : acc.balance, children: [] as Account[] }]));

    // 1. Reset all non-group account balances that are calculated dynamically
    const dynamicAccountCodes = ['1110', '4100', '5110', '5120', '5130', '5140', '3000'];
    dynamicAccountCodes.forEach(code => {
        const acc = accountMap.get(code);
        if(acc && !acc.isGroup) {
            acc.balance = 0;
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
    
    // 4. Calculate Equity
    // In a real system, this would be opening balance + profit/loss + contributions - withdrawals
    // For now, let's use a base and adjust for transactions.
    let totalEquity = 475000; // Base/opening equity from original JSON
    equityTransactions.forEach(t => {
        if (t.type === 'Contribution') {
            totalEquity += t.amount;
        } else if (t.type === 'Withdrawal') {
            totalEquity -= t.amount;
        }
    });

    if(accountMap.has('3000')) {
      accountMap.get('3000')!.balance = totalEquity;
    }

    // 5. Build tree structure for balance recalculation
    const rootAccounts: Account[] = [];
    accountMap.forEach(acc => {
        if (acc.parentCode && accountMap.has(acc.parentCode)) {
            // @ts-ignore
            accountMap.get(acc.parentCode)!.children.push(acc);
        } else {
            rootAccounts.push(acc);
        }
    });

    // 6. Recalculate parent balances from the bottom up
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

const updateAccountFormSchema = accountSchema.omit({ balance: true }).partial();
export async function updateAccount(data: z.infer<typeof updateAccountFormSchema>) {
    const validation = updateAccountFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allAccounts = await readData(accountsFilePath);
        const { code, ...dataToUpdate } = validation.data;

        const accountIndex = allAccounts.findIndex((acc: Account) => acc.code === code);
        if (accountIndex === -1) {
            return { success: false, error: `Account with code "${code}" not found.` };
        }
        
        allAccounts[accountIndex] = { ...allAccounts[accountIndex], ...dataToUpdate };

        await writeAccounts(allAccounts);
        
        revalidatePath('/finance/chart-of-accounts');
        return { success: true, data: allAccounts[accountIndex] };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function deleteAccount(code: string) {
    try {
        const allAccounts = await readData(accountsFilePath);
        const updatedAccounts = allAccounts.filter((acc: Account) => acc.code !== code && acc.parentCode !== code);

        if (allAccounts.length === updatedAccounts.length) {
            return { success: false, error: 'Account not found or no changes made.' };
        }

        await writeAccounts(updatedAccounts);
        revalidatePath('/finance/chart-of-accounts');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


async function getChildAccountCodes(parentCode: string, allAccounts: Account[]): Promise<string[]> {
    const children = allAccounts.filter(acc => acc.parentCode === parentCode);
    let childCodes: string[] = children.map(c => c.code);

    for (const child of children) {
        if (child.isGroup) {
            const grandChildCodes = await getChildAccountCodes(child.code, allAccounts);
            childCodes = [...childCodes, ...grandChildCodes];
        }
    }
    return childCodes;
}


export async function getTransactionsForAccount(accountCode: string): Promise<Payment[]> {
    const allAccounts: Account[] = await readData(accountsFilePath);
    const allPayments: Payment[] = await readData(paymentsFilePath);

    const targetAccount = allAccounts.find(acc => acc.code === accountCode);
    if (!targetAccount) return [];
    
    let codesToFetch: string[] = [accountCode];
    if (targetAccount.isGroup) {
        const childCodes = await getChildAccountCodes(accountCode, allAccounts);
        codesToFetch = [...codesToFetch, ...childCodes];
    }
    
    let transactions: Payment[] = [];

    for (const code of codesToFetch) {
         switch(code) {
            case '1110': // Cash and Bank
                 transactions.push(...allPayments.filter(p => p.currentStatus === 'POSTED'));
                break;
            case '3000': { // Equity
                 const equityTransactions: any[] = await readData(equityTransactionsFilePath);
                 transactions.push(...equityTransactions.map(t => ({
                    id: t.id,
                    type: t.type === 'Contribution' ? 'Receipt' : 'Payment',
                    date: t.date,
                    partyType: 'Customer', // Simplified for display
                    partyName: 'Owner',
                    amount: t.amount,
                    paymentMethod: 'Cash', // Simplified
                    referenceNo: t.remarks || 'Equity Transaction',
                    status: t.type === 'Contribution' ? 'Received' : 'Paid',
                    currentStatus: 'POSTED',
                 })));
                 break;
            }
            case '4100': // Rental Income
                transactions.push(...allPayments.filter(p => p.type === 'Receipt' && p.currentStatus === 'POSTED'));
                break;
            case '5110': // Maintenance & Repairs
                transactions.push(...allPayments.filter(p => p.type === 'Payment' && p.partyType === 'Vendor' && !p.agentCode && p.currentStatus === 'POSTED'));
                break;
            case '5140': // Agent Fee
                transactions.push(...allPayments.filter(p => p.type === 'Payment' && !!p.agentCode && p.currentStatus === 'POSTED'));
                break;
            default:
                // For other accounts, no specific transaction logic is defined yet.
                break;
        }
    }

    // Remove duplicates that might occur from parent-child relationships
    const uniqueTransactions = Array.from(new Map(transactions.map(item => [item.id, item])).values());
    
    return uniqueTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
