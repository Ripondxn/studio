
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { moduleSettingsSchema, type ModuleSettings } from './schema';

const settingsFilePath = path.join(process.cwd(), 'src/app/admin/access-control/module-settings.json');

const defaultSettings: ModuleSettings = {
    'lease': { id: 'lease', name: 'Lease Management Module', enabled: true },
    'finance': { id: 'finance', name: 'Finance Module', enabled: true },
    'tenant': { id: 'tenant', name: 'Tenant Module', enabled: true },
    'customer': { id: 'customer', name: 'Customer Module', enabled: true },
    'vendor': { id: 'vendor', name: 'Vendor / Supplier Module', enabled: true },
    'products': { id: 'products', name: 'Products & Services Module', enabled: true },
    'asset-management': { id: 'asset-management', name: 'Asset Management Module', enabled: true },
    'maintenance': { id: 'maintenance', name: 'Maintenance Module', enabled: true },
    'project-management': { id: 'project-management', name: 'Project Management Module', enabled: true },
    'human-resource': { id: 'human-resource', name: 'Human Resource Module', enabled: true },
    'rent-a-car': { id: 'rent-a-car', name: 'Rent-A-Car Module', enabled: true },
    'car-sales': { id: 'car-sales', name: 'Car Sales Module', enabled: true },
    'stores': { id: 'stores', name: 'Vaults & Stores Module', enabled: true },
    'workflow': { id: 'workflow', name: 'Workflow Module', enabled: true },
    'data-processing': { id: 'data-processing', name: 'Data Processing Module', enabled: true },
    'utilities': { id: 'utilities', name: 'Utilities Module', enabled: true },
    'settings': { id: 'settings', name: 'Settings', enabled: true }
};


export async function getModuleSettings(): Promise<ModuleSettings> {
    try {
        await fs.access(settingsFilePath);
        const data = await fs.readFile(settingsFilePath, 'utf-8');
        const savedSettings = JSON.parse(data);
        // Merge with defaults to ensure new modules are added
        return { ...defaultSettings, ...savedSettings };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(settingsFilePath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
            return defaultSettings;
        }
        throw error;
    }
}

export async function saveModuleSettings(data: ModuleSettings) {
    const validation = moduleSettingsSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.errors[0].message };
    }

    try {
        await fs.writeFile(settingsFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
        revalidatePath('/', 'layout'); // Revalidate everything to update sidebar
        return { success: true };
    } catch (error) {
        console.error('Failed to save module settings:', error);
        return { success: false, error: 'Failed to save settings.' };
    }
}
