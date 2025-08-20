
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const landlordsFilePath = path.join(process.cwd(), 'src/app/landlord/landlords-data.json');
const propertiesFilePath = path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json');
const leaseContractsFilePath = path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json');


async function readData(filePath: string) {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // Return empty array if file doesn't exist
        }
        throw error;
    }
}

async function getLandlords() {
    return await readData(landlordsFilePath);
}

async function writeLandlords(data: any) {
    await fs.writeFile(landlordsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getAllLandlords() {
    const landlords = await getLandlords();
    const leaseContracts = await readData(leaseContractsFilePath);

    const contractsByLandlord = new Map<string, string[]>();
    for (const contract of leaseContracts) {
        if (contract.landlordCode) {
            if (!contractsByLandlord.has(contract.landlordCode)) {
                contractsByLandlord.set(contract.landlordCode, []);
            }
            contractsByLandlord.get(contract.landlordCode)!.push(contract.contractNo);
        }
    }

    return landlords.map((l: any) => ({
        ...l.landlordData,
        attachments: l.attachments || [],
        leaseContracts: contractsByLandlord.get(l.landlordData.code)?.join(', ') || 'N/A',
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

async function getProperties() {
    return await readData(propertiesFilePath);
}

export async function getPropertiesForLandlord(landlordCode: string) {
    try {
        const allProperties = await getProperties();
        const landlordProperties = allProperties.filter((p: any) => {
            const propData = p.propertyData || p;
            return propData.landlordCode === landlordCode;
        }).map((p:any) => p.propertyData || p);
        
        return { success: true, data: landlordProperties };
    } catch (error) {
        console.error('Failed to get properties for landlord:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

export async function getLeaseContractsForLandlord(landlordCode: string) {
    try {
        const allContracts = await readData(leaseContractsFilePath);
        const landlordContracts = allContracts.filter((c: any) => c.landlordCode === landlordCode);
        return { success: true, data: landlordContracts };
    } catch (error) {
        console.error('Failed to get lease contracts for landlord:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}
