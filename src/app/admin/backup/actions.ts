
'use server';

import { promises as fs } from 'fs';
import path from 'path';

export type BackupSettings = {
    automaticBackupsEnabled: boolean;
    backupTime: string;
};

const settingsFilePath = path.join(process.cwd(), 'src/app/admin/backup/settings.json');

const defaultSettings: BackupSettings = {
    automaticBackupsEnabled: false,
    backupTime: '02:00' // Default to 2 AM UTC
};

export async function getBackupSettings(): Promise<BackupSettings> {
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

export async function saveBackupSettings(data: BackupSettings) {
    try {
        await fs.writeFile(settingsFilePath, JSON.stringify(data, null, 2), 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Failed to save backup settings:', error);
        return { success: false, error: 'Failed to save settings.' };
    }
}
