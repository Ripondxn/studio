
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const dataDirectory = path.join(process.cwd(), 'src/app');

// List of all transactional JSON files
const TRANSACTION_FILES = [
  'finance/payment/payments-data.json',
  'finance/cheque-deposit/cheques-data.json',
  'finance/cheque-management/cheques-data.json',
  'finance/equity/transactions.json',
  'finance/daily-checkout/checkouts-data.json',
  'tenancy/customer/invoice/invoices-data.json',
  'vendors/bill/bills-data.json',
  'stores/stock-transactions.json',
];

const bankAccountFilePath = path.join(dataDirectory, 'finance/banking/accounts-data.json');
const pettyCashFilePath = path.join(dataDirectory, 'finance/banking/petty-cash.json');
const chartOfAccountsFilePath = path.join(dataDirectory, 'finance/chart-of-accounts/accounts.json');

async function clearJsonFile(filePath: string) {
    const fullPath = path.join(dataDirectory, filePath);
    try {
        await fs.writeFile(fullPath, JSON.stringify([], null, 2), 'utf-8');
    } catch (error) {
        console.error(`Failed to clear file ${filePath}:`, error);
        // We can choose to throw or just log the error. For a reset, we'll log and continue.
    }
}

export async function resetAllTransactions() {
    try {
        for (const file of TRANSACTION_FILES) {
            await clearJsonFile(file);
        }
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'Failed to reset transactions.' };
    }
}


export async function resetBankingBalances() {
    try {
        // Reset bank accounts
        const bankAccounts = await fs.readFile(bankAccountFilePath, 'utf-8').then(JSON.parse).catch(() => []);
        const resetBankAccounts = bankAccounts.map((acc: any) => ({ ...acc, balance: 0 }));
        await fs.writeFile(bankAccountFilePath, JSON.stringify(resetBankAccounts, null, 2), 'utf-8');

        // Reset petty cash
        await fs.writeFile(pettyCashFilePath, JSON.stringify({ balance: 0 }, null, 2), 'utf-8');
        
        revalidatePath('/finance/banking');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'Failed to reset banking balances.' };
    }
}

export async function resetChartOfAccounts() {
    try {
        const accounts = await fs.readFile(chartOfAccountsFilePath, 'utf-8').then(JSON.parse).catch(() => []);
        const resetAccounts = accounts.map((acc: any) => ({ ...acc, balance: 0 }));
        await fs.writeFile(chartOfAccountsFilePath, JSON.stringify(resetAccounts, null, 2), 'utf-8');

        revalidatePath('/finance/chart-of-accounts');
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'Failed to reset chart of accounts.' };
    }
}
