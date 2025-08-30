

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Account } from './schema';

const accountsFilePath = path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json');

async function readData<T>(filePath: string, defaultValue: T[] = []): Promise<T[]> {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
            return defaultValue;
        }
        throw error;
    }
}

export async function getExpenseAccounts(): Promise<{ value: string; label: string }[]> {
    const accounts: Account[] = await readData(accountsFilePath);
    return accounts
        .filter(acc => acc.type === 'Expense' && !acc.isGroup)
        .map(acc => ({ value: acc.code, label: `${acc.name} (${acc.code})` }));
}

