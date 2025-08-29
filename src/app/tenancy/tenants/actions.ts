

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { type Contract } from '../contract/schema';
import { type Unit } from '@/app/property/units/schema';
import { type Room } from '@/app/property/rooms/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';

const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');
const propertiesFilePath = path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json');
const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');


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
    
    // Create a map of tenantCode to their contract.
    const contractsByTenantCode = new Map<string, Contract>();
    for (const contract of contracts) {
        if(contract.tenantCode) {
            contractsByTenantCode.set(contract.tenantCode, contract);
        }
    }

    return tenants.map((l: any) => {
        const tenantCode = l.tenantData.code;
        const contract = contractsByTenantCode.get(tenantCode);

        return {
            ...l.tenantData,
            attachments: l.attachments || [],
            contractId: contract?.id || null,
            contractNo: contract?.contractNo || null,
        }
    });
}

async function getNextTenantCode() {
    const allTenants = await getTenants();
    let maxNum = 0;
    allTenants.forEach((t: any) => {
        const code = t.tenantData.code || '';
        const match = code.match(/^T(\d+)$/);
        if(match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `T${(maxNum + 1).toString().padStart(4, '0')}`;
}

export async function saveTenantData(dataToSave: any, isNewRecord: boolean, isAutoCode: boolean) {
  try {
    const allTenants = await getTenants();
    let tenantData = dataToSave.tenantData;
    let savedTenant;
    
    if (isNewRecord) {
        if (isAutoCode) {
            tenantData.code = await getNextTenantCode();
        }
        const { code, name } = tenantData;
        const codeExists = allTenants.some((l: any) => l.tenantData.code === code);
        if (codeExists) {
            return { success: false, error: `Tenant with code "${code}" already exists.` };
        }
        const nameExists = allTenants.some((l: any) => l.tenantData.name.toLowerCase() === name.toLowerCase());
        if (nameExists) {
            return { success: false, error: `Tenant with name "${name}" already exists.` };
        }
        const newTenant = {
            id: `T${Date.now()}`,
            tenantData,
            attachments: dataToSave.attachments,
        };
        allTenants.push(newTenant);
        savedTenant = newTenant;

    } else {
        const { code, name } = tenantData;
        const index = allTenants.findIndex((l: any) => l.tenantData.code === code);

        if (index !== -1) {
             const nameExists = allTenants.some((l: any, i: number) => i !== index && l.tenantData.name.toLowerCase() === name.toLowerCase());
            if (nameExists) {
                return { success: false, error: `Another tenant with the name "${name}" already exists.` };
            }
            allTenants[index] = {
                ...allTenants[index],
                tenantData: {
                  ...allTenants[index].tenantData,
                  ...dataToSave.tenantData,
                },
                attachments: dataToSave.attachments,
                id: allTenants[index].id
            };
            savedTenant = allTenants[index];
        } else {
            return { success: false, error: `Tenant with code "${code}" not found.` };
        }
    }
    
    await writeTenants(allTenants);
    revalidatePath('/tenancy/tenants');

    return { success: true, data: savedTenant.tenantData };
  } catch (error) {
    console.error('Failed to save tenant data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function findTenantData(tenantCode: string) {
  try {
    const allTenants = await getTenants();

    if (tenantCode === 'new') {
        const newCode = await getNextTenantCode();
        return { success: true, data: { tenantData: { code: newCode } } };
    }

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

export async function cancelSubscription(tenantCode: string) {
    try {
        const allTenants = await getTenants();
        const index = allTenants.findIndex((t: any) => t.tenantData.code === tenantCode);

        if (index === -1) {
            return { success: false, error: 'Tenant not found.' };
        }

        allTenants[index].tenantData.isSubscriptionActive = false;
        allTenants[index].tenantData.subscriptionStatus = undefined;
        allTenants[index].tenantData.subscriptionAmount = 0;
        
        await writeTenants(allTenants);
        revalidatePath(`/tenancy/tenants/add?code=${tenantCode}`);
        return { success: true };

    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function getTenantLookups() {
    const properties = await readData(propertiesFilePath);
    
    return {
        properties: properties.map((p: any) => ({ value: (p.propertyData || p).code, label: (p.propertyData || p).name })),
    }
}

export async function getUnitsForProperty(propertyCode: string) {
    const allUnits: Unit[] = await readData(unitsFilePath);
    return allUnits
        .filter(u => u.propertyCode === propertyCode)
        .map(u => ({ value: u.unitCode, label: u.unitCode }));
}

export async function getRoomsForUnit(propertyCode: string, unitCode: string) {
    const allRooms: Room[] = await readData(roomsFilePath);
     return allRooms
        .filter(r => r.propertyCode === propertyCode && r.unitCode === unitCode)
        .map(r => ({ value: r.roomCode, label: r.roomCode }));
}

    
