

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
                ...dataToSave
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
