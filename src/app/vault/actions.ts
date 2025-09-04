
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { accountCredentialSchema, type AccountCredential } from './schema';

const credentialsFilePath = path.join(process.cwd(), 'src/app/vault/credentials-data.json');

async function readCredentials(): Promise<AccountCredential[]> {
    try {
        await fs.access(credentialsFilePath);
        const data = await fs.readFile(credentialsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeCredentials(data: AccountCredential[]) {
    await fs.writeFile(credentialsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function createAccountCredential(data: Omit<AccountCredential, 'id' | 'createdAt' | 'updatedAt'>) {
    const validation = accountCredentialSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allCredentials = await readCredentials();
        const newCredential: AccountCredential = {
            ...validation.data,
            id: `ACC-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        allCredentials.push(newCredential);
        await writeCredentials(allCredentials);
        
        revalidatePath('/vault');
        return { success: true, data: newCredential };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function getUserCredentials(userId: string) {
    try {
        const allCredentials = await readCredentials();
        const userCredentials = allCredentials.filter(c => c.userId === userId && !c.isDeleted);
        return { success: true, data: userCredentials };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function updateAccountCredential(docId: string, data: Partial<AccountCredential>) {
    const validation = accountCredentialSchema.partial().safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allCredentials = await readCredentials();
        const index = allCredentials.findIndex(c => c.id === docId);

        if (index === -1) {
            return { success: false, error: 'Credential not found.' };
        }

        allCredentials[index] = {
            ...allCredentials[index],
            ...validation.data,
            updatedAt: new Date().toISOString(),
        };
        
        await writeCredentials(allCredentials);
        revalidatePath('/vault');
        return { success: true, data: allCredentials[index] };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function deleteAccountCredential(docId: string) {
    try {
        const allCredentials = await readCredentials();
        const index = allCredentials.findIndex(c => c.id === docId);

        if (index === -1) {
            return { success: false, error: 'Credential not found.' };
        }

        // Soft delete
        allCredentials[index].isDeleted = true;
        allCredentials[index].updatedAt = new Date().toISOString();
        
        await writeCredentials(allCredentials);
        revalidatePath('/vault');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
