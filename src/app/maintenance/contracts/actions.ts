
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { maintenanceContractSchema, type MaintenanceContract } from './schema';
import { type Vendor } from '@/app/vendors/schema';
import { type Property } from '@/app/property/properties/list/schema';

const contractsFilePath = path.join(process.cwd(), 'src/app/maintenance/contracts/contracts-data.json');

async function readContracts(): Promise<MaintenanceContract[]> {
    try {
        await fs.access(contractsFilePath);
        const data = await fs.readFile(contractsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeContracts([]);
            return [];
        }
        throw error;
    }
}

async function writeContracts(data: MaintenanceContract[]) {
    await fs.writeFile(contractsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAllMaintenanceContracts() {
    return await readContracts();
}

async function getNextContractNumber() {
    const allContracts = await readContracts();
    let maxNum = 0;
    allContracts.forEach(c => {
        const match = c.contractNo.match(/^MC-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `MC-${(maxNum + 1).toString().padStart(4, '0')}`;
}

export async function saveMaintenanceContract(data: Omit<MaintenanceContract, 'id'> & { id?: string, isAutoContractNo?: boolean }, isNewRecord: boolean) {
    const { isAutoContractNo, ...contractData } = data;
    const validation = maintenanceContractSchema.omit({id: true}).safeParse(contractData);

    if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(', ');
        return { success: false, error: errors };
    }

    try {
        const allContracts = await readContracts();
        let savedContract: MaintenanceContract;
        const validatedData = validation.data;
        
        if (isNewRecord) {
             let newContractNo = validatedData.contractNo;
             if (isAutoContractNo || !newContractNo) {
                newContractNo = await getNextContractNumber();
             } else {
                 const contractExists = allContracts.some(c => c.contractNo === newContractNo);
                 if (contractExists) {
                    return { success: false, error: `A contract with number "${newContractNo}" already exists.`};
                 }
             }

             const newContract: MaintenanceContract = {
                ...validatedData,
                contractNo: newContractNo,
                id: `MCON-${Date.now()}`,
            };
            allContracts.push(newContract);
            savedContract = newContract;
        } else {
            const index = allContracts.findIndex(c => c.id === data.id);
            if (index !== -1) {
                allContracts[index] = { ...allContracts[index], ...validatedData };
                savedContract = allContracts[index];
            } else {
                 return { success: false, error: `Maintenance Contract with ID "${data.id}" not found.` };
            }
        }
        
        await writeContracts(allContracts);

        revalidatePath('/maintenance/contracts');
        revalidatePath(`/maintenance/contracts/add?id=${savedContract.id}`);
        return { success: true, data: savedContract };

    } catch (error) {
        console.error('Failed to save maintenance contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

const initialContractState: Omit<MaintenanceContract, 'id'> = {
    contractNo: '',
    contractDate: '',
    propertyCode: '',
    vendorCode: '',
    serviceType: '',
    startDate: '',
    endDate: '',
    totalValue: 0,
    status: 'Active',
    paymentFrequency: 'Monthly',
    numberOfPayments: 1,
    paymentSchedule: [],
    terms: '',
};

export async function findMaintenanceContract(query: { contractId?: string }): Promise<{ success: boolean; data?: MaintenanceContract; error?: string }> {
    try {
        const allContracts = await readContracts();
        let foundContract: MaintenanceContract | undefined;

        if (query.contractId === 'new') {
            const newContractNo = await getNextContractNumber();
            return { success: true, data: { ...initialContractState, id: '', contractNo: newContractNo } };
        }
        
        if (query.contractId) {
            foundContract = allContracts.find(c => c.id === query.contractId);
        }

        if (foundContract) {
            return { success: true, data: foundContract };
        } else {
            return { success: false, error: 'Maintenance Contract not found.' };
        }
    } catch (error) {
        console.error('Failed to find maintenance contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}


export async function deleteMaintenanceContract(contractId: string) {
    try {
        const allContracts = await readContracts();
        const updatedContracts = allContracts.filter(c => c.id !== contractId);

        if (allContracts.length === updatedContracts.length) {
            return { success: false, error: 'Maintenance Contract not found.' };
        }
        
        await writeContracts(updatedContracts);
        revalidatePath('/maintenance/contracts');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete maintenance contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

async function readVendors(): Promise<{vendorData: Vendor}[]> {
    try {
        const data = await fs.readFile(path.join(process.cwd(), 'src/app/vendors/vendors-data.json'), 'utf-8');
        return JSON.parse(data);
    } catch(e) {
        return [];
    }
}

async function readProperties(): Promise<{propertyData: Property}[]> {
    try {
        const data = await fs.readFile(path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json'), 'utf-8');
        return JSON.parse(data);
    } catch(e) {
        return [];
    }
}

export async function getContractLookups() {
    const vendors = await readVendors();
    const properties = await readProperties();

    return {
        vendors: vendors.map((v:any) => ({ value: v.vendorData.code, label: v.vendorData.name })),
        properties: properties.map((p:any) => ({ value: (p.propertyData || p).code, label: (p.propertyData || p).name })),
    }
}
