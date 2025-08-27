
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { type Payment } from '../finance/payment/schema';

const vendorsFilePath = path.join(process.cwd(), 'src/app/vendors/vendors-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');

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
    // The list page expects a flat structure for each vendor, plus attachments.
    return vendors.map((v: any) => ({
        ...v.vendorData,
        attachments: v.attachments || []
    }));
}

async function getNextVendorCode() {
    const allVendors = await getVendors();
    let maxNum = 0;
    allVendors.forEach((v: any) => {
        const code = v.vendorData.code || '';
        const match = code.match(/^V(\d+)$/);
        if(match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `V${(maxNum + 1).toString().padStart(4, '0')}`;
}

export async function saveVendorData(dataToSave: any, isNewRecord: boolean, isAutoCode: boolean) {
  try {
    const allVendors = await getVendors();
    let vendorData = dataToSave.vendorData;
    let savedVendor;
    
    if (isNewRecord) {
        if (isAutoCode) {
            vendorData.code = await getNextVendorCode();
        }
        const { code } = vendorData;
        const vendorExists = allVendors.some((v: any) => v.vendorData.code === code);
        if (vendorExists) {
            return { success: false, error: `Vendor with code "${code}" already exists.` };
        }
        const newVendor = {
            id: `V-${Date.now()}`,
            ...dataToSave,
            vendorData
        };
        allVendors.push(newVendor);
        savedVendor = newVendor;
    } else {
        const { code } = vendorData;
        const index = allVendors.findIndex((v: any) => v.vendorData.code === code);

        if (index !== -1) {
            allVendors[index] = {
                ...allVendors[index],
                ...dataToSave,
                id: allVendors[index].id // Preserve original ID
            };
            savedVendor = allVendors[index];
        } else {
            return { success: false, error: `Vendor with code "${code}" not found.` };
        }
    }
    
    await writeVendors(allVendors);
    revalidatePath('/vendors');

    return { success: true, data: savedVendor.vendorData };
  } catch (error) {
    console.error('Failed to save vendor data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function findVendorData(vendorCode: string) {
  try {
    const allVendors = await getVendors();
    
    if (vendorCode === 'new') {
        const newVendorCode = await getNextVendorCode();
        return { success: true, data: { vendorData: { code: newVendorCode } } };
    }

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

async function readPayments(): Promise<Payment[]> {
    try {
        const paymentsData = await fs.readFile(paymentsFilePath, 'utf-8');
        return JSON.parse(paymentsData);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error('Failed to read payments file:', error);
        return [];
    }
}

export async function getPaymentsForVendor(vendorCode: string): Promise<Payment[]> {
    try {
        const allPayments = await readPayments();
        // Vendors are identified by code. Fetch both Payments to and Receipts (refunds) from them.
        const vendorPayments = allPayments.filter(p => p.partyName === vendorCode && p.partyType === 'Vendor');
        return vendorPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error('Failed to get payments for vendor:', error);
        return [];
    }
}
