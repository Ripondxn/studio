
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const vendorsFilePath = path.join(process.cwd(), 'src/app/vendors/vendors-data.json');

async function getVendors() {
    try {
        await fs.access(vendorsFilePath);
        const data = await fs.readFile(vendorsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // Return empty array if file doesn't exist
        }
        throw error;
    }
}

async function writeVendors(data: any) {
    await fs.writeFile(vendorsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getAllVendors() {
    const vendors = await getVendors();
    // The list page expects a flat structure for each vendor.
    return vendors.map((v: any) => v.vendorData);
}

export async function saveVendorData(dataToSave: any, isNewRecord: boolean) {
  try {
    const allVendors = await getVendors();
    const { code } = dataToSave.vendorData;

    if (isNewRecord) {
        const vendorExists = allVendors.some((v: any) => v.vendorData.code === code);
        if (vendorExists) {
            return { success: false, error: `Vendor with code "${code}" already exists.` };
        }
        const newVendor = {
            id: `V-${Date.now()}`,
            ...dataToSave
        };
        allVendors.push(newVendor);
    } else {
        const index = allVendors.findIndex((v: any) => v.vendorData.code === code);

        if (index !== -1) {
            allVendors[index] = {
                ...allVendors[index],
                ...dataToSave,
                id: allVendors[index].id // Preserve original ID
            };
        } else {
            return { success: false, error: `Vendor with code "${code}" not found.` };
        }
    }
    
    await writeVendors(allVendors);
    revalidatePath('/vendors');

    return { success: true };
  } catch (error) {
    console.error('Failed to save vendor data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function findVendorData(vendorCode: string) {
  try {
    const allVendors = await getVendors();
    const vendor = allVendors.find((v: any) => v.vendorData.code === vendorCode);

    if (vendor) {
       return { success: true, data: vendor };
    } else {
       return { success: false, error: "Not Found" };
    }
  } catch (error) {
    console.error('Failed to find vendor data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function deleteVendorData(vendorCode: string) {
    try {
        const allVendors = await getVendors();
        const updatedVendors = allVendors.filter((v: any) => v.vendorData.code !== vendorCode);

        if (allVendors.length === updatedVendors.length) {
            return { success: false, error: 'Vendor not found.' };
        }

        await writeVendors(updatedVendors);
        revalidatePath('/vendors');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete vendor data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}
