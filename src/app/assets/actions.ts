
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { assetSchema, type Asset, type AssetHistory } from './schema';

const assetsFilePath = path.join(process.cwd(), 'src/app/assets/assets-data.json');


async function readAssets(): Promise<Asset[]> {
    try {
        await fs.access(assetsFilePath);
        const data = await fs.readFile(assetsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeAssets([]);
            return [];
        }
        throw error;
    }
}

async function writeAssets(data: Asset[]) {
    await fs.writeFile(assetsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAssets(): Promise<Asset[]> {
    const assets = await readAssets();
    // Calculate current value for each asset
    return assets.map(asset => {
        const depreciation = calculateDepreciation(asset);
        return {
            ...asset,
            currentValue: asset.purchaseCost - depreciation,
        };
    });
}

const addAssetFormSchema = assetSchema.omit({ id: true, currentValue: true, history: true });

async function getNextAssetCode() {
    const allAssets = await readAssets();
    let maxNum = 0;
    allAssets.forEach(asset => {
        const match = asset.assetCode.match(/^ASSET-(\d+)$/);
        if(match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `ASSET-${(maxNum + 1).toString().padStart(4, '0')}`;
}

export async function saveAsset(data: z.infer<typeof addAssetFormSchema>, isNewRecord: boolean, isAutoCode: boolean, id?: string) {
    const validation = addAssetFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allAssets = await readAssets();
        let assetData = validation.data;

        if (isNewRecord) { // Create new
            if (isAutoCode) {
                assetData.assetCode = await getNextAssetCode();
            } else {
                const assetExists = allAssets.some(a => a.assetCode === assetData.assetCode);
                if(assetExists) {
                     return { success: false, error: `Asset with code "${assetData.assetCode}" already exists.` };
                }
            }
            const newAsset: Asset = {
                ...assetData,
                id: `ASSET-${Date.now()}`,
                history: [{
                    date: new Date().toISOString(),
                    status: 'In Stock',
                    assignedTo: '',
                    notes: 'Asset created.'
                }]
            };
            allAssets.push(newAsset);
        } else { // Update existing
            const index = allAssets.findIndex(a => a.id === id);
            if(index === -1) return { success: false, error: 'Asset not found.'};
            allAssets[index] = { ...allAssets[index], ...assetData };
        }

        await writeAssets(allAssets);
        revalidatePath('/assets');
        return { success: true, data: assetData };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function deleteAsset(assetId: string) {
     try {
        const allAssets = await readAssets();
        const updatedAssets = allAssets.filter(asset => asset.id !== assetId);
        
        if (allAssets.length === updatedAssets.length) {
            return { success: false, error: 'Asset not found.' };
        }

        await writeAssets(updatedAssets);
        revalidatePath('/assets');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


function calculateDepreciation(asset: Asset): number {
    const purchaseDate = new Date(asset.purchaseDate);
    const now = new Date();
    const ageInYears = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    if (ageInYears <= 0 || asset.usefulLife <= 0) {
        return 0;
    }

    const effectiveAge = Math.min(ageInYears, asset.usefulLife);
    const depreciableValue = asset.purchaseCost - asset.salvageValue;

    if (depreciableValue <= 0) {
        return 0;
    }

    let totalDepreciation = 0;

    if (asset.depreciationMethod === 'Straight-Line') {
        const annualDepreciation = depreciableValue / asset.usefulLife;
        totalDepreciation = annualDepreciation * effectiveAge;
    } else if (asset.depreciationMethod === 'Declining Balance') {
        const rate = (1 / asset.usefulLife) * 2; // Double-declining balance
        let bookValue = asset.purchaseCost;
        for (let i = 0; i < Math.floor(effectiveAge); i++) {
            const annualDepreciation = bookValue * rate;
            bookValue -= annualDepreciation;
        }
        // Prorate for the partial year
        if (effectiveAge % 1 !== 0) {
             const partialYearDepreciation = bookValue * rate * (effectiveAge % 1);
             bookValue -= partialYearDepreciation;
        }
        totalDepreciation = asset.purchaseCost - bookValue;
    }

    return Math.min(totalDepreciation, depreciableValue);
}

const updateStatusSchema = z.object({
    id: z.string(),
    status: z.enum(['In Stock', 'Assigned', 'Damaged', 'Out for Repair', 'Retired']),
    assignedTo: z.string().optional(),
    notes: z.string().optional(),
});

export async function updateAssetStatus(data: z.infer<typeof updateStatusSchema>) {
    const validation = updateStatusSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allAssets = await readAssets();
        const index = allAssets.findIndex(a => a.id === data.id);
        if (index === -1) {
            return { success: false, error: 'Asset not found.' };
        }

        const newHistoryEntry: AssetHistory = {
            date: new Date().toISOString(),
            status: data.status,
            assignedTo: data.assignedTo,
            notes: data.notes,
        };

        allAssets[index] = {
            ...allAssets[index],
            status: data.status,
            assignedTo: data.assignedTo,
            history: [...(allAssets[index].history || []), newHistoryEntry],
        };

        await writeAssets(allAssets);
        revalidatePath('/assets');
        return { success: true, data: allAssets[index] };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

    