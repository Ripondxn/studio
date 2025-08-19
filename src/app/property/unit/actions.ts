

'use server';

import { promises as fs } from 'fs';
import path from 'path';

const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');

async function getUnits() {
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

async function writeUnits(data: any) {
    await fs.writeFile(unitsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function saveUnitData(dataToSave: any, isNewRecord: boolean) {
  try {
    const allUnits = await getUnits();

    if (isNewRecord) {
        const unitExists = allUnits.some((u: any) => u.unitCode === dataToSave.unitData.unitCode);
        if (unitExists) {
            return { success: false, error: `Unit with code "${dataToSave.unitData.unitCode}" already exists.` };
        }
         const newUnit = {
            id: `UNIT-${Date.now()}`,
            ...dataToSave.unitData
        };
        allUnits.push(newUnit);
    } else {
        const index = allUnits.findIndex((u: any) => u.unitCode === dataToSave.unitData.unitCode);
        if (index !== -1) {
            allUnits[index] = { ...allUnits[index], ...dataToSave.unitData };
        } else {
            // This case should ideally not happen if the UI flow is correct
            return { success: false, error: `Unit with code "${dataToSave.unitData.unitCode}" not found for updating.` };
        }
    }
    
    await writeUnits(allUnits);
    
    console.log('Saving unit data:', JSON.stringify(dataToSave, null, 2));

    return { success: true };
  } catch (error) {
    console.error('Failed to save unit data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function findUnitData(unitCode: string) {
  try {
    const allUnits = await getUnits();
    const unit = allUnits.find((u: any) => u.unitCode === unitCode);
    
    if (unit) {
       return { success: true, data: unit };
    } else {
       return { success: false, error: "Not Found" }; 
    }
  } catch (error) {
    console.error('Failed to find unit data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}
