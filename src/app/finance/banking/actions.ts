
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { bankAccountSchema, type BankAccount } from './schema';

const accountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');

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

export async function getBankAccounts() {
    return await readAccounts();
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
