
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { contractSchema, type Contract } from './schema';

const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');

async function readContracts(): Promise<Contract[]> {
    try {
        await fs.access(contractsFilePath);
        const data = await fs.readFile(contractsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeContracts(data: Contract[]) {
    await fs.writeFile(contractsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function saveContractData(data: Omit<Contract, 'id'>) {
    const validationSchema = contractSchema.omit({ id: true });
    const validation = validationSchema.safeParse(data);

    if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(', ');
        return { success: false, error: errors };
    }

    try {
        const allContracts = await readContracts();
        const contractExists = allContracts.some(c => c.contractNo === data.contractNo);
        
        if (contractExists) {
            return { success: false, error: `Contract with number "${data.contractNo}" already exists.`};
        }
        
        const newContract: Contract = {
            id: `CON-${Date.now()}`,
            ...validation.data,
        };

        allContracts.push(newContract);
        await writeContracts(allContracts);
        
        revalidatePath('/dashboard');
        return { success: true, data: newContract };

    } catch (error) {
        console.error('Failed to save contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
