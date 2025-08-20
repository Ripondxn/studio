
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { unitSchema, type Unit } from './schema';

const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');

async function readUnits(): Promise<Unit[]> {
    try {
        await fs.access(unitsFilePath);
        const data = await fs.readFile(unitsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeUnits([]);
            return [];
        }
        throw error;
    }
}

async function writeUnits(data: Unit[]) {
    await fs.writeFile(unitsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getUnits() {
    return await readUnits();
}

export async function getUnitsForProperty(propertyCode: string) {
    try {
        const allUnits = await readUnits();
        const propertyUnits = allUnits.filter(u => u.propertyCode === propertyCode);
        return { success: true, data: propertyUnits };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}


const addUnitFormSchema = unitSchema.omit({ id: true });

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
        
        revalidatePath(`/property/properties?code=${data.propertyCode}`);
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
        
        revalidatePath(`/property/properties?code=${allUnits[unitIndex].propertyCode}`);
        return { success: true, data: allUnits[unitIndex] };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function deleteUnit(unitId: string) {
    try {
        const allUnits = await readUnits();
        const unitToDelete = allUnits.find(u => u.id === unitId);
        if (!unitToDelete) {
             return { success: false, error: 'Unit not found.' };
        }

        const updatedUnits = allUnits.filter(u => u.id !== unitId);
        
        await writeUnits(updatedUnits);
        revalidatePath(`/property/properties?code=${unitToDelete.propertyCode}`);
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
