

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

async function getUnits(): Promise<Unit[]> {
    return await readData(unitsFilePath);
}

async function getProperties() {
    return await readData(propertiesFilePath);
}

async function getRooms(): Promise<Room[]> {
    return await readData(roomsFilePath);
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

export async function saveTenantData(dataToSave: any, isNewRecord: boolean) {
  try {
    const allTenants = await getTenants();
    
    if (isNewRecord) {
        const { code } = dataToSave.tenantData;
        const tenantExists = allTenants.some((l: any) => l.tenantData.code === code);
        if (tenantExists) {
            return { success: false, error: `Tenant with code "${code}" already exists.` };
        }
        const newTenant = {
            id: `T${Date.now()}`,
            ...dataToSave
        };
        allTenants.push(newTenant);
    } else {
        const { code } = dataToSave.tenantData;
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

    if (tenantCode === 'new') {
        let maxNum = 0;
        allTenants.forEach((t: any) => {
            const code = t.tenantData.code || '';
            const match = code.match(/^T(\d{3,})$/);
            if(match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum) {
                    maxNum = num;
                }
            }
        });
        const newCode = `T${(maxNum + 1).toString().padStart(3, '0')}`;
        return { success: true, data: { tenantData: { code: newCode } } };
    }

    const tenant = allTenants.find((l: any) => l.tenantData.code === tenantCode);

    if (tenant) {
       const allContracts = await getContracts();
       let contractData: Partial<Contract> = {};
       let unitData: Partial<Unit & { property?: any }> = {};
       let roomData: Partial<Room> = {};

       const relatedContract = allContracts.find(c => c.tenantCode === tenantCode);
       
       if(relatedContract) {
            contractData = relatedContract;
            tenant.tenantData.contractNo = relatedContract.contractNo;

            if (relatedContract.unitCode) {
                const allUnits = await getUnits();
                const relatedUnit = allUnits.find(u => u.unitCode === relatedContract.unitCode);
                
                if (relatedUnit) {
                    const allProperties = await getProperties();
                    const relatedProperty = allProperties.find(p => (p.propertyData || p).code === relatedUnit.propertyCode);
                    
                    unitData = {
                        ...relatedUnit,
                        property: relatedProperty ? (relatedProperty.propertyData || relatedProperty) : null
                    };

                    const allRooms = await getRooms();
                    const relatedRoom = allRooms.find(r => r.unitCode === relatedUnit.unitCode && r.propertyCode === relatedUnit.propertyCode);
                    if(relatedRoom) roomData = relatedRoom;
                }
            }
       }

       return { success: true, data: {...tenant, contractData, unitData, roomData } };
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
