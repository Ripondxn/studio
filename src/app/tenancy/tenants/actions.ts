
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');

async function getTenants() {
    try {
        await fs.access(tenantsFilePath);
        const data = await fs.readFile(tenantsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeTenants(data: any) {
    await fs.writeFile(tenantsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getAllTenants() {
    const tenants = await getTenants();
    return tenants.map((l: any) => ({
        ...l.tenantData,
        attachments: l.attachments || []
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
       return { success: true, data: tenant };
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
