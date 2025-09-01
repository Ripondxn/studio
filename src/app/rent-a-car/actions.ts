
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { rentalSchema, type Rental } from './schema';

const rentalsFilePath = path.join(process.cwd(), 'src/app/rent-a-car/rentals-data.json');

async function readRentals(): Promise<Rental[]> {
    try {
        await fs.access(rentalsFilePath);
        const data = await fs.readFile(rentalsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeRentals([]);
            return [];
        }
        throw error;
    }
}

async function writeRentals(data: Rental[]) {
    await fs.writeFile(rentalsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAllRentals() {
    return await readRentals();
}

async function getNextContractNumber(type: 'Hired' | 'Rented') {
    const allRentals = await readRentals();
    const prefix = type === 'Hired' ? 'RAC-H' : 'RAC-R';
    let maxNum = 0;
    allRentals.forEach(r => {
        const match = r.contractNo.match(new RegExp(`^${prefix}-(\d+)$`));
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `${prefix}-${(maxNum + 1).toString().padStart(4, '0')}`;
}

const formSchema = rentalSchema.omit({ id: true });

export async function saveRental(data: Omit<Rental, 'id'> & { id?: string, isAutoContractNo?: boolean }) {
    const { isAutoContractNo, ...rentalData } = data;
    const validation = formSchema.safeParse(rentalData);
    if (!validation.success) {
        return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
    }
    
    try {
        const allRentals = await readRentals();
        let savedRental: Rental;

        if (!data.id) { // Create new
            let newContractNo = rentalData.contractNo;
            if (isAutoContractNo || !newContractNo) {
                newContractNo = await getNextContractNumber(rentalData.rentalType);
            }
            const newRental = { ...validation.data, contractNo: newContractNo, id: `RAC-${Date.now()}` };
            allRentals.push(newRental);
            savedRental = newRental;
        } else { // Update
            const index = allRentals.findIndex(r => r.id === data.id);
            if (index === -1) return { success: false, error: 'Rental record not found.' };
            allRentals[index] = { ...allRentals[index], ...validation.data };
            savedRental = allRentals[index];
        }

        await writeRentals(allRentals);
        revalidatePath('/rent-a-car');
        return { success: true, data: savedRental };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteRental(id: string) {
    try {
        const allRentals = await readRentals();
        const updatedRentals = allRentals.filter(r => r.id !== id);
        if (allRentals.length === updatedRentals.length) {
            return { success: false, error: 'Rental record not found.' };
        }
        await writeRentals(updatedRentals);
        revalidatePath('/rent-a-car');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
