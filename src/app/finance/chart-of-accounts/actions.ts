
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { accountSchema, type Account } from './schema';

const accountsFilePath = path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json');

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
    return await readAccounts();
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
