

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Unit } from '@/app/property/units/schema';
import { type Contract } from '@/app/tenancy/contract/schema';
import { type Floor } from '../floors/schema';
import { type Room } from '../rooms/schema';
import { type Partition } from '../partitions/schema';

const propertiesFilePath = path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');
const floorsFilePath = path.join(process.cwd(), 'src/app/property/floors/floors-data.json');
const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');
const partitionsFilePath = path.join(process.cwd(), 'src/app/property/partitions/partitions-data.json');


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


async function getProperties() {
    try {
        const data = await fs.readFile(propertiesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, return an empty array
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeProperties(data: any) {
    await fs.writeFile(propertiesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


// This is a placeholder for your real database logic.
export async function savePropertyData(dataToSave: any, isNewRecord: boolean) {
  try {
    const allProperties = await getProperties();

    if (isNewRecord) {
        const propertyExists = allProperties.some((p: any) => (p.propertyData ? p.propertyData.code : p.code) === dataToSave.propertyData.code);
        if (propertyExists) {
            return { success: false, error: `Property with code "${dataToSave.propertyData.code}" already exists.` };
        }
        const newProperty = {
            id: `PROP-${Date.now()}`, // Generate a unique ID
            ...dataToSave
        };
        allProperties.push(newProperty);
    } else {
        const index = allProperties.findIndex((p: any) => {
            const code = p.propertyData ? p.propertyData.code : p.code;
            return code === dataToSave.propertyData.code;
        });

        if (index !== -1) {
            allProperties[index] = {
                ...allProperties[index],
                ...dataToSave,
                id: allProperties[index].id
            };
        } else {
             // If for some reason we are editing but can't find the record, add it as new
            const newProperty = {
                id: `PROP-${Date.now()}`,
                ...dataToSave,
            };
            allProperties.push(newProperty);
        }
    }
    
    await writeProperties(allProperties);

    return { success: true };
  } catch (error) {
    console.error('Failed to save property data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function findPropertyData(propertyCode: string) {
  try {
    const allProperties = await getProperties();
    const property = allProperties.find((p: any) => (p.propertyData ? p.propertyData.code : p.code) === propertyCode);

    if (property) {
       return { success: true, data: property };
    } else {
       return { success: false, error: "Not Found" };
    }
  } catch (error) {
    console.error('Failed to find property data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function deletePropertyData(propertyCode: string) {
    try {
        const allProperties = await getProperties();
        const updatedProperties = allProperties.filter((p: any) => {
            // Handle both nested and flat structures
            const code = p.propertyData ? p.propertyData.code : p.code;
            return code !== propertyCode;
        });

        if (allProperties.length === updatedProperties.length) {
            // No property was deleted, which means it wasn't found
            return { success: false, error: 'Property not found.' };
        }

        await writeProperties(updatedProperties);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete property data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

export async function getOccupancyInfoForProperty(propertyCode: string) {
    try {
        const contractsData = await fs.readFile(contractsFilePath, 'utf-8');
        const allContracts = JSON.parse(contractsData);
        
        const occupancyInfo = allContracts
            .filter((c: any) => c.property === propertyCode)
            .map((c: any) => ({
                unitCode: c.unitCode,
                tenantName: c.tenantName,
                contractId: c.id,
            }));

        return { success: true, data: occupancyInfo };
    } catch (error) {
        console.error('Failed to get occupancy info:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

async function readUnits(): Promise<Unit[]> {
    try {
        const data = await fs.readFile(unitsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}


export async function getUnitsForProperty(propertyCode: string): Promise<{ success: boolean, data?: Unit[], error?: string }> {
    try {
        const allUnits = await readUnits();
        const contractsData = await fs.readFile(contractsFilePath, 'utf-8').catch(() => '[]');
        const allContracts: Contract[] = JSON.parse(contractsData);
        const floorsData = await fs.readFile(floorsFilePath, 'utf-8').catch(() => '[]');
        const allFloors: Floor[] = JSON.parse(floorsData);

        const floorMap = new Map(allFloors.map(f => [f.floorCode, f.floorName]));

        const occupiedUnitCodes = new Set(
            allContracts
                .filter(c => c.status === 'New' || c.status === 'Renew')
                .map(c => c.unitCode)
        );

        const propertyUnits = allUnits
            .filter(u => u.propertyCode === propertyCode)
            .map(unit => ({
                ...unit,
                floor: floorMap.get(unit.floor) || unit.floor, // Replace floor code with floor name
                occupancyStatus: occupiedUnitCodes.has(unit.unitCode) ? 'Occupied' : 'Vacant',
            }));
            
        return { success: true, data: propertyUnits };
    } catch (error) {
        console.error('Failed to get units for property:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

async function readLandlords() {
    try {
        const data = await fs.readFile(path.join(process.cwd(), 'src/app/landlord/landlords-data.json'), 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export async function getPropertyLookups() {
    const landlords = await readLandlords();
    return {
        landlords: landlords.map((l: any) => ({ code: l.landlordData.code, name: l.landlordData.name })),
    }
}
