
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { type Contract } from '../contract/schema';

const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');


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

async function getTenants() {
    return await readData(tenantsFilePath);
}

async function getContracts(): Promise<Contract[]> {
    return await readData(contractsFilePath);
}

async function writeTenants(data: any) {
    await fs.writeFile(tenantsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getAllTenants() {
    const tenants = await getTenants();
    const contracts = await getContracts();
    
    const contractsMap = new Map(contracts.map(c => [c.contractNo, c.id]));

    return tenants.map((l: any) => ({
        ...l.tenantData,
        attachments: l.attachments || [],
        contractId: contractsMap.get(l.tenantData.contractNo) || null
    }));
}

export async function saveTenantData(dataToSave: any, isNewRecord: boolean) {
  try {
    const allTenants = await getTenants();
    const { code } = dataToSave.tenantData;

    if (isNewRecord) {
        const tenantExists = allTenants.some((l: any) => l.tenantData.code === code);
        if (tenantExists) {
            return { success: false, error: `Tenant with code "${code}" already exists.` };
        }
        const newTenant = {
            id: `T-${Date.now()}`,
            ...dataToSave
        };
        allTenants.push(newTenant);
    } else {
        const index = allTenants.findIndex((l: any) => l.tenantData.code === code);

        if (index !== -1) {
            allTenants[index] = {
                ...allTenants[index],
                ...dataToSave,
                id: allTenants[index].id
            };
        } else {
            return { success: false, error: `Tenant with code "${code}" not found.` };
        }
    }
    
    await writeTenants(allTenants);
    revalidatePath('/tenancy/tenants');

    return { success: true };
  } catch (error) {
    console.error('Failed to save tenant data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function findTenantData(tenantCode: string) {
  try {
    const allTenants = await getTenants();
    const tenant = allTenants.find((l: any) => l.tenantData.code === tenantCode);

    if (tenant) {
       const allContracts = await getContracts();
       let contractData: Partial<Contract> = {};

       if(tenant.tenantData.contractNo) {
         const relatedContract = allContracts.find(c => c.contractNo === tenant.tenantData.contractNo);
         if(relatedContract) {
            contractData = relatedContract;
         }
       }

       return { success: true, data: {...tenant, contractData } };
    } else {
       return { success: false, error: "Not Found" };
    }
  } catch (error) {
    console.error('Failed to find tenant data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function deleteTenantData(tenantCode: string) {
    try {
        const allTenants = await getTenants();
        const updatedTenants = allTenants.filter((l: any) => l.tenantData.code !== tenantCode);

        if (allTenants.length === updatedTenants.length) {
            return { success: false, error: 'Tenant not found.' };
        }

        await writeTenants(updatedTenants);
        revalidatePath('/tenancy/tenants');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete tenant data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}
