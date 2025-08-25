
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export type CurrencySettings = {
    currencyCode: string;
};

const settingsFilePath = path.join(process.cwd(), 'src/app/admin/currency/settings.json');

const defaultSettings: CurrencySettings = {
    currencyCode: 'AED'
};

export async function getCurrencySettings(): Promise<CurrencySettings> {
    try {
        await fs.access(settingsFilePath);
        const data = await fs.readFile(settingsFilePath, 'utf-8');
        return { ...defaultSettings, ...JSON.parse(data) };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return defaultSettings;
        }
        throw error;
    }
}

const currencySettingsSchema = z.object({
    currencyCode: z.string().length(3, "Currency code must be 3 characters long.").toUpperCase(),
});

export async function saveCurrencySettings(data: CurrencySettings) {
    const validation = currencySettingsSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.errors[0].message };
    }

    try {
        await fs.writeFile(settingsFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
        revalidatePath('/', 'layout'); // Revalidate all pages
        return { success: true };
    } catch (error) {
        console.error('Failed to save currency settings:', error);
        return { success: false, error: 'Failed to save settings.' };
    }
}
