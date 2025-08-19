
'use server';

import { promises as fs } from 'fs';
import path from 'path';

const propertiesFilePath = path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json');

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
    await fs.writeFile(propertiesFilePath, JSON.stringify(data, null, 4), 'utf-8');
}


// This is a placeholder for your real database logic.
export async function savePropertyData(dataToSave: any, isNewRecord: boolean) {
  try {
    const { propertyData } = dataToSave;
    const allProperties = await getProperties();

    if (isNewRecord) {
        const newProperty = {
            id: `PROP-${Date.now()}`, // Generate a unique ID
            code: propertyData.code,
            name: propertyData.name,
            propertyType: propertyData.propertyType,
            status: propertyData.status,
            noOfUnits: propertyData.noOfUnits,
        };
        allProperties.push(newProperty);
    } else {
        const index = allProperties.findIndex((p: any) => p.code === propertyData.code);
        if (index !== -1) {
            allProperties[index] = {
                ...allProperties[index],
                name: propertyData.name,
                propertyType: propertyData.propertyType,
                status: propertyData.status,
                noOfUnits: propertyData.noOfUnits,
            };
        } else {
             // If for some reason we are editing but can't find the record, add it as new
            const newProperty = {
                id: `PROP-${Date.now()}`,
                code: propertyData.code,
                name: propertyData.name,
                propertyType: propertyData.propertyType,
                status: propertyData.status,
                noOfUnits: propertyData.noOfUnits,
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
    const property = allProperties.find((p: any) => p.code === propertyCode);

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
