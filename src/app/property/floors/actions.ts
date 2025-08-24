

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { floorSchema, type Floor } from './schema';
import { type Unit } from '../units/schema';
import { type Contract } from '@/app/tenancy/contract/schema';

const floorsFilePath = path.join(process.cwd(), 'src/app/property/floors/floors-data.json');
const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');
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

async function readFloors(): Promise<Floor[]> {
    return await readData(floorsFilePath);
}
async function readUnits(): Promise<Unit[]> {
    return await readData(unitsFilePath);
}
async function readContracts(): Promise<Contract[]> {
    return await readData(contractsFilePath);
}

async function writeFloors(data: Floor[]) {
    await fs.writeFile(floorsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getFloors() {
    return await readFloors();
}

export async function getFloorsForProperty(propertyCode: string) {
    try {
        const allFloors = await readFloors();
        const propertyFloors = allFloors.filter(f => f.propertyCode === propertyCode);

        const allUnits = await readUnits();
        const allContracts = await readContracts();
        const occupiedUnitCodes = new Set(allContracts.filter(c => c.status === 'New' || c.status === 'Renew').map(c => c.unitCode));

        const floorsWithOccupancy = propertyFloors.map(floor => {
            const unitsOnFloor = allUnits.filter(u => u.propertyCode === propertyCode && u.floor === floor.floorCode);
            const occupiedUnitsCount = unitsOnFloor.filter(u => occupiedUnitCodes.has(u.unitCode)).length;

            let occupancyStatus: 'Fully Occupied' | 'Partially Occupied' | 'Vacant' = 'Vacant';
            if (unitsOnFloor.length > 0) {
                if (occupiedUnitsCount === unitsOnFloor.length) {
                    occupancyStatus = 'Fully Occupied';
                } else if (occupiedUnitsCount > 0) {
                    occupancyStatus = 'Partially Occupied';
                }
            }
            
            return {
                ...floor,
                occupancyStatus
            }
        });
        
        return { success: true, data: floorsWithOccupancy };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}


const addFloorFormSchema = floorSchema.omit({ id: true });

export async function addFloor(data: z.infer<typeof addFloorFormSchema>) {
    const validation = addFloorFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allFloors = await readFloors();
        const floorExists = allFloors.some(f => f.floorCode === data.floorCode && f.propertyCode === data.propertyCode);
        if (floorExists) {
            return { success: false, error: `Floor with code "${data.floorCode}" already exists in this property.` };
        }

        const newFloor: Floor = {
            ...validation.data,
            id: `FLR-${Date.now()}`,
        };

        allFloors.push(newFloor);
        await writeFloors(allFloors);
        
        revalidatePath(`/property/properties?code=${data.propertyCode}`);
        return { success: true, data: newFloor };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

const updateFloorFormSchema = floorSchema.partial();

export async function updateFloor(data: z.infer<typeof updateFloorFormSchema>) {
     const validation = updateFloorFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const { id, ...dataToUpdate } = validation.data;

    try {
        const allFloors = await readFloors();
        const floorIndex = allFloors.findIndex(f => f.id === id);
        if (floorIndex === -1) {
            return { success: false, error: 'Floor not found.' };
        }
        
        allFloors[floorIndex] = { ...allFloors[floorIndex], ...dataToUpdate };
        
        await writeFloors(allFloors);
        
        revalidatePath(`/property/properties?code=${allFloors[floorIndex].propertyCode}`);
        return { success: true, data: allFloors[floorIndex] };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function deleteFloor(floorId: string) {
    try {
        const allFloors = await readFloors();
        const floorToDelete = allFloors.find(f => f.id === floorId);
        if (!floorToDelete) {
             return { success: false, error: 'Floor not found.' };
        }

        const updatedFloors = allFloors.filter(f => f.id !== floorId);
        
        await writeFloors(updatedFloors);
        revalidatePath(`/property/properties?code=${floorToDelete.propertyCode}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
