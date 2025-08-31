

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { unitSchema, type Unit } from './schema';
import { type Contract } from '@/app/tenancy/contract/schema';
import { type Room } from '../rooms/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';

const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');


async function readData<T>(filePath: string): Promise<any[]> {
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

async function readUnits(): Promise<Unit[]> {
    return await readData(unitsFilePath);
}
async function writeUnits(data: Unit[]) {
    await fs.writeFile(unitsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getUnits() {
    const allUnits = await readUnits();
    const allContracts: Contract[] = await readData(contractsFilePath);
    const allRooms: Room[] = await readData(roomsFilePath);
    const allTenants: {tenantData: Tenant}[] = await readData(tenantsFilePath);

    const activeContracts = allContracts.filter(c => c.status === 'New' || c.status === 'Renew');
    const activeSubscriptionTenants = allTenants.filter(t => t.tenantData.isSubscriptionActive);

    // 1. Consolidate all occupied spaces from both sources
    const fullyOccupiedUnitCodes = new Set<string>();
    activeContracts.filter(c => !c.roomCode && c.unitCode).forEach(c => fullyOccupiedUnitCodes.add(c.unitCode!));
    activeSubscriptionTenants.filter(t => t.tenantData.unitCode && !t.tenantData.roomCode).forEach(t => fullyOccupiedUnitCodes.add(t.tenantData.unitCode!));

    const occupiedRoomCodes = new Set<string>();
    activeContracts.filter(c => c.roomCode).forEach(c => occupiedRoomCodes.add(c.roomCode!));
    activeSubscriptionTenants.filter(t => t.tenantData.roomCode).forEach(t => occupiedRoomCodes.add(t.tenantData.roomCode!));
    
    // 2. Determine status for each unit based on the consolidated data
    return allUnits.map(unit => {
        let occupancyStatus: 'Vacant' | 'Occupied' | 'Partially Occupied' = 'Vacant';

        // Case 1: The entire unit is rented under one agreement.
        if (fullyOccupiedUnitCodes.has(unit.unitCode)) {
            occupancyStatus = 'Occupied';
        } else {
            // Case 2: The unit is not rented as a whole, so check its rooms.
            const roomsInUnit = allRooms.filter(r => r.propertyCode === unit.propertyCode && r.unitCode === unit.unitCode);
            
            if (roomsInUnit.length > 0) {
                // It's a parent unit with rooms. Check how many are occupied.
                const occupiedRoomsCount = roomsInUnit.filter(r => occupiedRoomCodes.has(r.roomCode)).length;

                if (occupiedRoomsCount === 0) {
                    occupancyStatus = 'Vacant';
                } else if (occupiedRoomsCount < roomsInUnit.length) {
                    occupancyStatus = 'Partially Occupied';
                } else { // occupiedRoomsCount === roomsInUnit.length
                    occupancyStatus = 'Occupied';
                }
            } else {
                // Case 3: It's a standalone unit with no rooms and no active contract/subscription.
                occupancyStatus = 'Vacant';
            }
        }

        return {
            ...unit,
            occupancyStatus,
        };
    });
}

const addUnitFormSchema = unitSchema.omit({ id: true, occupancyStatus: true, unitName: true, annualRent: true });

export async function addUnit(data: z.infer<typeof addUnitFormSchema>) {
    const validation = addUnitFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allUnits = await readUnits();
        const unitExists = allUnits.some(u => u.unitCode === data.unitCode && u.propertyCode === data.propertyCode);
        if (unitExists) {
            return { success: false, error: `Unit with code "${data.unitCode}" already exists in this property.` };
        }

        const newUnit: Unit = {
            ...validation.data,
            id: `UNIT-${Date.now()}`,
            floor: '',
            annualRent: 0,
        };

        allUnits.push(newUnit);
        await writeUnits(allUnits);
        
        revalidatePath(`/property/properties`);
        revalidatePath(`/property/properties/add`);
        revalidatePath(`/property/properties/list`);
        revalidatePath(`/property/units/list`);
        if (data.propertyCode) {
            revalidatePath(`/property/properties?code=${data.propertyCode}`);
        }
        return { success: true, data: newUnit };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

const updateUnitFormSchema = unitSchema.partial();

export async function updateUnit(data: z.infer<typeof updateUnitFormSchema>) {
     const validation = updateUnitFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const { id, ...dataToUpdate } = validation.data;

    try {
        const allUnits = await readUnits();
        const unitIndex = allUnits.findIndex(u => u.id === id);
        if (unitIndex === -1) {
            return { success: false, error: 'Unit not found.' };
        }
        
        allUnits[unitIndex] = { ...allUnits[unitIndex], ...dataToUpdate };
        
        await writeUnits(allUnits);
        
        revalidatePath(`/property/properties`);
        revalidatePath(`/property/properties/add`);
        revalidatePath(`/property/properties/list`);
        revalidatePath(`/property/units/list`);

        if (allUnits[unitIndex].propertyCode) {
           revalidatePath(`/property/properties?code=${allUnits[unitIndex].propertyCode}`);
        }

        return { success: true, data: allUnits[unitIndex] };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function deleteUnit(unitId: string) {
    if (!unitId) {
        return { success: false, error: "Unit ID is required." };
    }

    try {
        const allUnits = await readUnits();
        const unitToDelete = allUnits.find(u => u.id === unitId);
        
        if (!unitToDelete) {
             return { success: false, error: 'Unit not found.' };
        }

        const updatedUnits = allUnits.filter(u => u.id !== unitId);
        
        await writeUnits(updatedUnits);

        revalidatePath(`/property/properties`);
        revalidatePath(`/property/properties/add`);
        revalidatePath(`/property/properties/list`);
        revalidatePath(`/property/units/list`);
        if (unitToDelete.propertyCode) {
            revalidatePath(`/property/properties?code=${unitToDelete.propertyCode}`);
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

async function readProperties() {
    try {
        const data = await fs.readFile(path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json'), 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export async function getUnitLookups(propertyCode: string) {
    const properties = await readProperties();
    return {
        properties: properties.map((p:any) => ({ value: p.propertyData.code, label: p.propertyData.name })),
    }
}


const importUnitSchema = unitSchema.omit({ id: true, occupancyStatus: true });
const importUnitsSchema = z.array(importUnitSchema);

export async function importUnits(unitsData: unknown) {
    const validation = importUnitsSchema.safeParse(unitsData);
    if (!validation.success) {
        console.error("Import validation error:", validation.error.format());
        return { success: false, error: 'Invalid data format for one or more rows.' };
    }
    
    try {
        const allUnits = await readUnits();
        let updatedCount = 0;
        let addedCount = 0;
        let propertyCodeForRevalidation = '';

        validation.data.forEach(importedUnit => {
            if (importedUnit.propertyCode) {
                 propertyCodeForRevalidation = importedUnit.propertyCode;
            }

            const existingUnitIndex = allUnits.findIndex(u => u.unitCode === importedUnit.unitCode && u.propertyCode === importedUnit.propertyCode);
            
            if (existingUnitIndex > -1) {
                // Update existing unit
                allUnits[existingUnitIndex] = { ...allUnits[existingUnitIndex], ...importedUnit };
                updatedCount++;
            } else {
                // Add new unit
                const newUnit: Unit = {
                    ...importedUnit,
                    id: `UNIT-${Date.now()}-${Math.random()}`.replace('.', ''),
                };
                allUnits.push(newUnit);
                addedCount++;
            }
        });

        await writeUnits(allUnits);
        
        if (propertyCodeForRevalidation) {
            revalidatePath(`/property/properties?code=${propertyCodeForRevalidation}`);
        }
        
        return { success: true, added: addedCount, updated: updatedCount };

    } catch (error) {
        console.error("Error importing units:", error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred during import.' };
    }
}

    