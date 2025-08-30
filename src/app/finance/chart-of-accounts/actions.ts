

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { accountSchema, type Account } from './schema';
import { type BankAccount } from '../banking/schema';
import { type Payment } from '../payment/schema';
import { getAssets } from '@/app/assets/actions';
import { type StockTransaction } from '@/app/stores/schema';
import { type Product } from '@/app/products/schema';


const accountsFilePath = path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json');
const bankAccountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const pettyCashFilePath = path.join(process.cwd(), 'src/app/finance/banking/petty-cash.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const equityTransactionsFilePath = path.join(process.cwd(), 'src/app/finance/equity/transactions.json');
const stockTransactionsFilePath = path.join(process.cwd(), 'src/app/stores/stock-transactions.json');
const productsFilePath = path.join(process.cwd(), 'src/app/products/products-data.json');


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
    const pettyCashData = await readData(pettyCashFilePath);
    const pettyCash = pettyCashData.balance || 0;
    const payments: Payment[] = await readData(paymentsFilePath);
    const equityTransactions: any[] = await readData(equityTransactionsFilePath);
    const assets = await getAssets();
    const stockTransactions: StockTransaction[] = await readData(stockTransactionsFilePath);
    const products: Product[] = await readData(productsFilePath);


    // Create a map for easy access and modification
    const accountMap = new Map<string, Account>(accounts.map(acc => [acc.code, { ...acc, balance: 0, children: [] as Account[] }]));

    // 1. Reset all non-group account balances
     accountMap.forEach(acc => {
        if (!acc.isGroup) {
            acc.balance = 0;
        }
    });

    // 2. Calculate Cash and Bank from bank accounts and petty cash
    const totalCashAndBank = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0) + (pettyCash || 0);
    if (accountMap.has('1110')) {
        accountMap.get('1110')!.balance = totalCashAndBank;
    }
    
    // 3. Aggregate asset values into fixed asset accounts
    // This is a simplified aggregation. A real system would map asset types to specific accounts.
    const totalFixedAssets = assets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
    // For now, let's put the total into the 'Office Equipment' account as a representative example.
    if (accountMap.has('1220')) {
        accountMap.get('1220')!.balance = totalFixedAssets;
    }

    // 4. Aggregate stock value into inventory account
    const inventoryValue = stockTransactions.reduce((acc, tx) => {
        const product = products.find((p:any) => p.id === tx.productId);
        const cost = product?.costPrice || 0;
        if(tx.type === 'IN') return acc + (tx.quantity * cost);
        if(tx.type === 'OUT') return acc - (tx.quantity * cost);
        return acc;
    }, 0);
    if (accountMap.has('1140')) {
        accountMap.get('1140')!.balance = inventoryValue;
    }


    // 5. Aggregate payments into expense and revenue accounts
    payments.forEach(payment => {
        if (payment.currentStatus !== 'POSTED') return; // Only consider posted transactions

        if (payment.type === 'Payment' && payment.expenseAccountId) {
            if (accountMap.has(payment.expenseAccountId)) {
                accountMap.get(payment.expenseAccountId)!.balance += payment.amount;
            }
        } else if (payment.type === 'Receipt') { // Rental Income
            if (accountMap.has('4110')) {
                accountMap.get('4110')!.balance += payment.amount;
            }
        }
    });
    
    // 6. Calculate Equity
    let capital = 0;
    let drawings = 0;
    equityTransactions.forEach(t => {
        if (t.type === 'Contribution') {
            capital += t.amount;
        } else if (t.type === 'Withdrawal') {
            drawings += t.amount;
        }
    });

    if(accountMap.has('3110')) accountMap.get('3110')!.balance = capital;
    if(accountMap.has('3120')) accountMap.get('3120')!.balance = drawings;


    // 7. Build tree structure for balance recalculation
    const roots: Account[] = [];
    accountMap.forEach(acc => {
        const parent = acc.parentCode ? accountMap.get(acc.parentCode) : null;
        if (parent) {
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(acc);
        } else {
            roots.push(acc);
        }
    });

    // 8. Recalculate parent balances from the bottom up using a post-order traversal
    function calculateParentBalances(account: Account): number {
        if (!account.isGroup) {
            return account.balance;
        }

        const sum = (account.children || []).reduce((acc, child) => {
            return acc + calculateParentBalances(child);
        }, 0);
        
        account.balance = sum;
        return sum;
    }
    
    roots.forEach(calculateParentBalances);

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
        
        // Find all child codes recursively to delete them as well
        const codesToDelete = new Set<string>([code]);
        const findChildren = (parentCode: string) => {
            allAccounts.forEach((acc: Account) => {
                if (acc.parentCode === parentCode) {
                    codesToDelete.add(acc.code);
                    if (acc.isGroup) {
                        findChildren(acc.code);
                    }
                }
            });
        };
        findChildren(code);

        const updatedAccounts = allAccounts.filter((acc: Account) => !codesToDelete.has(acc.code));

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
            case '1210': // Furniture & Fixtures
            case '1220': // Office Equipment
            case '1230': // Vehicles
                 const allEquityTransactions: any[] = await readData(equityTransactionsFilePath);
                 
                 // This logic shows all posted transactions for any asset/bank account.
                 transactions.push(...allPayments.filter(p => p.currentStatus === 'POSTED' && (p.paymentFrom === 'Bank' || p.paymentFrom === 'Petty Cash')));
                 
                 const equityAsPayments = allEquityTransactions.map(t => ({
                    id: t.id,
                    type: t.type === 'Contribution' ? 'Receipt' : 'Payment',
                    date: t.date,
                    partyType: 'Customer',
                    partyName: 'Owner',
                    amount: t.amount,
                    paymentMethod: t.accountId === 'acc_3' ? 'Cash' : 'Bank Transfer',
                    bankAccountId: t.accountId,
                    referenceNo: t.remarks || 'Equity Transaction',
                    status: t.type === 'Contribution' ? 'Received' : 'Paid',
                    currentStatus: 'POSTED',
                 }));
                 transactions.push(...equityAsPayments);

                break;
            case '3110': // Capital Account
                 const contributionTransactions: any[] = (await readData(equityTransactionsFilePath)).filter(t => t.type === 'Contribution');
                 transactions.push(...contributionTransactions.map(t => ({
                    id: t.id,
                    type: 'Receipt',
                    date: t.date,
                    partyType: 'Customer', // Simplified for display
                    partyName: 'Owner',
                    amount: t.amount,
                    paymentMethod: 'Cash', // Simplified
                    referenceNo: t.remarks || 'Equity Transaction',
                    status: 'Received',
                    currentStatus: 'POSTED',
                 })));
                 break;
             case '3120': // Drawings
                const withdrawalTransactions: any[] = (await readData(equityTransactionsFilePath)).filter(t => t.type === 'Withdrawal');
                 transactions.push(...withdrawalTransactions.map(t => ({
                    id: t.id,
                    type: 'Payment',
                    date: t.date,
                    partyType: 'Customer', // Simplified for display
                    partyName: 'Owner',
                    amount: t.amount,
                    paymentMethod: 'Cash', // Simplified
                    referenceNo: t.remarks || 'Equity Transaction',
                    status: 'Paid',
                    currentStatus: 'POSTED',
                 })));
                 break;
            case '4110': // Rental Income
                transactions.push(...allPayments.filter(p => p.type === 'Receipt' && p.currentStatus === 'POSTED'));
                break;
            default:
                // For expense accounts, filter by the specific account code.
                if (targetAccount.type === 'Expense') {
                    transactions.push(...allPayments.filter(p => p.expenseAccountId === code && p.currentStatus === 'POSTED'));
                }
                break;
        }
    }

    // Remove duplicates that might occur from parent-child relationships
    const uniqueTransactions = Array.from(new Map(transactions.map(item => [item.id, item])).values());
    
    return uniqueTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

