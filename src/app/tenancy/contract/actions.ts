
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { contractSchema, type Contract } from './schema';
import { type Unit } from '@/app/property/units/schema';
import { type Floor } from '@/app/property/floors/schema';
import { type Room } from '@/app/property/rooms/schema';
import { type Partition } from '@/app/property/partitions/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';

const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');
const propertiesFilePath = path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json');
const floorsFilePath = path.join(process.cwd(), 'src/app/property/floors/floors-data.json');
const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');
const partitionsFilePath = path.join(process.cwd(), 'src/app/property/partitions/partitions-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');


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

async function readUnits(): Promise<Unit[]> {
    try {
        const data = await fs.readFile(unitsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

async function readProperties() {
    try {
        const data = await fs.readFile(propertiesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

async function readFloors(): Promise<Floor[]> {
    try {
        const data = await fs.readFile(floorsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
async function readRooms(): Promise<Room[]> {
    try {
        const data = await fs.readFile(roomsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
async function readPartitions(): Promise<Partition[]> {
    try {
        const data = await fs.readFile(partitionsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
async function readTenants(): Promise<{tenantData: Tenant}[]> {
    try {
        const data = await fs.readFile(tenantsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}


export async function getContractLookups() {
    const properties = await readProperties();
    const tenants = await readTenants();
    return {
        properties: properties.map((p: any) => ({ value: (p.propertyData || p).code, label: (p.propertyData || p).name })),
        tenants: tenants.map((t: any) => ({ value: t.tenantData.code, label: t.tenantData.name, ...t.tenantData })),
    }
}

export async function getUnitsForProperty(propertyCode: string) {
    const units = await readUnits();
    return units
        .filter(u => u.propertyCode === propertyCode)
        .map((u: any) => ({ value: u.unitCode, label: u.unitName || u.unitCode }));
}

export async function getRoomsForUnit(propertyCode: string, unitCode: string) {
    const rooms = await readRooms();
    return rooms
        .filter(r => r.propertyCode === propertyCode && r.unitCode === unitCode)
        .map((r: any) => ({ value: r.roomCode, label: `${r.roomCode} (${r.roomName || 'No Name'})` }));
}

export async function getPartitionsForUnit(propertyCode: string, unitCode: string) {
    const partitions = await readPartitions();
    return partitions
        .filter(p => p.propertyCode === propertyCode && p.unitCode === unitCode)
        .map((p: any) => ({ value: p.partitionCode, label: p.partitionName }));
}

export async function getPartitionDetails(partitionCode: string) {
    const allPartitions = await readPartitions();
    const partition = allPartitions.find(p => p.partitionCode === partitionCode);

    if (!partition) {
        return { success: false, error: 'Partition not found' };
    }
    
    return { 
        success: true, 
        data: {
            totalRent: partition.monthlyRent,
        }
    };
}


export async function getUnitDetails(unitCode: string) {
    const allUnits = await readUnits();
    const unit = allUnits.find(u => u.unitCode === unitCode);

    if (!unit) {
        return { success: false, error: 'Unit not found' };
    }

    const allProperties = await readProperties();
    const property = allProperties.find(p => (p.propertyData || p).code === unit.propertyCode);
    
    const allTenants = await readTenants();
    const tenant = allTenants.find((t: any) => t.tenantData.unitCode === unit.unitCode);

    return { 
        success: true, 
        data: {
            property: property ? (property.propertyData || property).name : '',
            tenant: tenant ? tenant.tenantData : null,
            totalRent: unit.annualRent,
        }
    };
}
