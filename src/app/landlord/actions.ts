
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const landlordsFilePath = path.join(process.cwd(), 'src/app/landlord/landlords-data.json');

async function getLandlords() {
    try {
        await fs.access(landlordsFilePath);
        const data = await fs.readFile(landlordsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // Return empty array if file doesn't exist
        }
        throw error;
    }
}

async function writeLandlords(data: any) {
    await fs.writeFile(landlordsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getAllLandlords() {
    const landlords = await getLandlords();
    // The list page expects a flat structure for each landlord.
    return landlords.map((l: any) => ({
        ...l.landlordData,
        attachments: l.attachments || []
    }));
}

export async function saveLandlordData(dataToSave: any, isNewRecord: boolean) {
  try {
    const allLandlords = await getLandlords();
    const { code } = dataToSave.landlordData;

    if (isNewRecord) {
        const landlordExists = allLandlords.some((l: any) => l.landlordData.code === code);
        if (landlordExists) {
            return { success: false, error: `Landlord with code "${code}" already exists.` };
        }
        const newLandlord = {
            id: `L-${Date.now()}`,
            ...dataToSave
        };
        allLandlords.push(newLandlord);
    } else {
        const index = allLandlords.findIndex((l: any) => l.landlordData.code === code);

        if (index !== -1) {
            allLandlords[index] = {
                ...allLandlords[index],
                ...dataToSave,
                id: allLandlords[index].id // Preserve original ID
            };
        } else {
            return { success: false, error: `Landlord with code "${code}" not found.` };
        }
    }
    
    await writeLandlords(allLandlords);
    revalidatePath('/landlord');

    return { success: true };
  } catch (error) {
    console.error('Failed to save landlord data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function findLandlordData(landlordCode: string) {
  try {
    const allLandlords = await getLandlords();
    const landlord = allLandlords.find((l: any) => l.landlordData.code === landlordCode);

    if (landlord) {
       return { success: true, data: landlord };
    } else {
       return { success: false, error: "Not Found" };
    }
  } catch (error) {
    console.error('Failed to find landlord data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function deleteLandlordData(landlordCode: string) {
    try {
        const allLandlords = await getLandlords();
        const updatedLandlords = allLandlords.filter((l: any) => l.landlordData.code !== landlordCode);

        if (allLandlords.length === updatedLandlords.length) {
            return { success: false, error: 'Landlord not found.' };
        }

        await writeLandlords(updatedLandlords);
        revalidatePath('/landlord');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete landlord data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}
