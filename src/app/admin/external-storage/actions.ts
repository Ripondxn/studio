
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const storageSettingsSchema = z.object({
    provider: z.enum(['local', 'google-drive']).default('local'),
    googleDriveApiKey: z.string().optional(),
    enabled: z.boolean().default(false),
});

export type StorageSettings = z.infer<typeof storageSettingsSchema>;

const settingsFilePath = path.join(process.cwd(), 'src/app/admin/external-storage/settings.json');

const defaultSettings: StorageSettings = {
    provider: 'local',
    enabled: false,
};

export async function getStorageSettings(): Promise<StorageSettings> {
    try {
        await fs.access(settingsFilePath);
        const data = await fs.readFile(settingsFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        return storageSettingsSchema.parse(parsed); // Validate data on read
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // Create file with default settings if it doesn't exist
            await fs.writeFile(settingsFilePath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
            return defaultSettings;
        }
        console.error("Failed to read storage settings, returning defaults.", error);
        return defaultSettings;
    }
}

export async function saveStorageSettings(data: StorageSettings) {
    const validation = storageSettingsSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.errors[0].message };
    }

    try {
        await fs.writeFile(settingsFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
        revalidatePath('/admin/external-storage'); 
        return { success: true };
    } catch (error) {
        console.error('Failed to save storage settings:', error);
        return { success: false, error: 'Failed to save settings.' };
    }
}
