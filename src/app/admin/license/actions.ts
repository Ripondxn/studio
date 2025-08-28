
'use server';

import { promises as fs } from 'fs';
import path from 'path';

export type LicenseSettings = {
    trialCheckEnabled: boolean;
};

const settingsFilePath = path.join(process.cwd(), 'src/app/admin/license/settings.json');

const defaultSettings: LicenseSettings = {
    trialCheckEnabled: true
};

export async function getLicenseSettings(): Promise<LicenseSettings> {
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

export async function saveLicenseSettings(data: LicenseSettings) {
    try {
        await fs.writeFile(settingsFilePath, JSON.stringify(data, null, 2), 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Failed to save license settings:', error);
        return { success: false, error: 'Failed to save settings.' };
    }
}
