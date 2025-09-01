
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { vehicleSchema, type Vehicle } from './schema';

const vehiclesFilePath = path.join(process.cwd(), 'src/app/car-sales/vehicles-data.json');

async function readVehicles(): Promise<Vehicle[]> {
    try {
        await fs.access(vehiclesFilePath);
        const data = await fs.readFile(vehiclesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(vehiclesFilePath, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
        throw error;
    }
}

async function writeVehicles(data: Vehicle[]) {
    await fs.writeFile(vehiclesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAllVehicles() {
    const vehicles = await readVehicles();
    return vehicles.map(v => ({
        ...v,
        profitOrLoss: (v.salePrice || 0) - (v.purchasePrice || 0) - (v.expenses || 0)
    }));
}

const formSchema = vehicleSchema.omit({ id: true, profitOrLoss: true });

export async function saveVehicle(data: Omit<Vehicle, 'id' | 'profitOrLoss'> & { id?: string }) {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
    }

    try {
        const allVehicles = await readVehicles();
        let savedVehicle: Vehicle;

        if (data.id) { // Update
            const index = allVehicles.findIndex(v => v.id === data.id);
            if (index === -1) return { success: false, error: 'Vehicle not found.' };
            allVehicles[index] = { ...allVehicles[index], ...validation.data };
            savedVehicle = allVehicles[index];
        } else { // Create
            const newVehicle = { ...validation.data, id: `VEH-${Date.now()}` };
            allVehicles.push(newVehicle);
            savedVehicle = newVehicle;
        }

        await writeVehicles(allVehicles);
        revalidatePath('/car-sales');
        return { success: true, data: savedVehicle };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteVehicle(id: string) {
    try {
        const allVehicles = await readVehicles();
        const updatedVehicles = allVehicles.filter(v => v.id !== id);
        if (allVehicles.length === updatedVehicles.length) {
            return { success: false, error: 'Vehicle not found.' };
        }
        await writeVehicles(updatedVehicles);
        revalidatePath('/car-sales');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
