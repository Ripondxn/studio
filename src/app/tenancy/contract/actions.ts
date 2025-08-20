
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

export async function getAllContracts() {
    return await readContracts();
}

export async function saveContractData(data: Contract, isNewRecord: boolean) {
    const validation = contractSchema.safeParse(data);

    if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(', ');
        return { success: false, error: errors };
    }

    try {
        const allContracts = await readContracts();
        
        if (isNewRecord) {
             const contractExists = allContracts.some(c => c.contractNo === data.contractNo);
             if (contractExists) {
                return { success: false, error: `Contract with number "${data.contractNo}" already exists.`};
             }
             const newContract: Contract = {
                ...validation.data,
                id: `CON-${Date.now()}`,
            };
            allContracts.push(newContract);
        } else {
            const index = allContracts.findIndex(c => c.id === data.id);
            if (index !== -1) {
                allContracts[index] = validation.data;
            } else {
                 return { success: false, error: `Contract with ID "${data.id}" not found.` };
            }
        }
        
        await writeContracts(allContracts);
        
        revalidatePath('/tenancy/contracts');
        revalidatePath(`/tenancy/contract?id=${data.id}`);
        return { success: true, data: isNewRecord ? allContracts[allContracts.length - 1] : data };

    } catch (error) {
        console.error('Failed to save contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function findContract(query: { unitCode?: string, tenantName?: string, contractId?: string }): Promise<{ success: boolean; data?: Contract; error?: string }> {
    try {
        const allContracts = await readContracts();
        let foundContract: Contract | undefined;
        
        if (query.contractId) {
            foundContract = allContracts.find(c => c.id === query.contractId);
        } else if (query.unitCode) {
            foundContract = allContracts.find(c => c.unitCode === query.unitCode);
        } else if (query.tenantName) {
            foundContract = allContracts.find(c => c.tenantName.toLowerCase() === query.tenantName.toLowerCase());
        }

        if (foundContract) {
            return { success: true, data: foundContract };
        } else {
            return { success: false, error: 'Contract not found.' };
        }
    } catch (error) {
        console.error('Failed to find contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}


export async function deleteContract(contractId: string) {
    try {
        const allContracts = await readContracts();
        const updatedContracts = allContracts.filter(c => c.id !== contractId);

        if (allContracts.length === updatedContracts.length) {
            return { success: false, error: 'Contract not found.' };
        }
        
        await writeContracts(updatedContracts);
        revalidatePath('/tenancy/contracts');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
