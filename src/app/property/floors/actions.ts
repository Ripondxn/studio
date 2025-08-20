
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { floorSchema, type Floor } from './schema';

const floorsFilePath = path.join(process.cwd(), 'src/app/property/floors/floors-data.json');

async function readFloors(): Promise<Floor[]> {
    try {
        await fs.access(floorsFilePath);
        const data = await fs.readFile(floorsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeFloors([]);
            return [];
        }
        throw error;
    }
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
        return { success: true, data: propertyFloors };
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
