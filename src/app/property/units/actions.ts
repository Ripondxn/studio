

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { unitSchema, type Unit } from './schema';
import { type Contract } from '@/app/tenancy/contract/schema';
import { type Room } from '../rooms/schema';

const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');


async function readData(filePath: string): Promise<any[]> {
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

    const activeContracts = allContracts.filter(c => c.status === 'New' || c.status === 'Renew');
    
    const occupiedUnitCodes = new Set(activeContracts.filter(c => !c.roomCode).map(c => c.unitCode));
    const occupiedRoomCodes = new Set(activeContracts.filter(c => c.roomCode).map(c => c.roomCode));

    return allUnits.map(unit => {
        const roomsInUnit = allRooms.filter(r => r.propertyCode === unit.propertyCode && r.unitCode === unit.unitCode);
        
        let occupancyStatus: 'Vacant' | 'Occupied' | 'Partially Occupied' = 'Vacant';

        if (roomsInUnit.length > 0) {
            const occupiedRoomsCount = roomsInUnit.filter(r => occupiedRoomCodes.has(r.roomCode)).length;
            if (occupiedRoomsCount === 0) {
                occupancyStatus = 'Vacant';
            } else if (occupiedRoomsCount < roomsInUnit.length) {
                occupancyStatus = 'Partially Occupied';
            } else {
                occupancyStatus = 'Occupied';
            }
        } else {
            if (occupiedUnitCodes.has(unit.unitCode)) {
                occupancyStatus = 'Occupied';
            }
        }

        return {
            ...unit,
            occupancyStatus,
        };
    });
}

const addUnitFormSchema = unitSchema.omit({ id: true, occupancyStatus: true });

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


async function readFloors() {
    try {
        const data = await fs.readFile(path.join(process.cwd(), 'src/app/property/floors/floors-data.json'), 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
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
    const floors = await readFloors();
    const properties = await readProperties();
    return {
        properties: properties.map((p:any) => ({ value: p.propertyData.code, label: p.propertyData.name })),
        floors: floors.filter((f: any) => f.propertyCode === propertyCode).map((f:any) => ({ value: f.floorCode, label: f.floorName })),
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
