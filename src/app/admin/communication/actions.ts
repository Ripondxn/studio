
'use server';

import { promises as fs } from 'fs';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'src/app/admin/communication/settings.json');

const defaultSettings = {
    sendgridApiKey: '',
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: ''
};

async function readSettings() {
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

async function writeSettings(data: any) {
    await fs.writeFile(settingsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getCommunicationSettings() {
    try {
        const settings = await readSettings();
        return { success: true, data: settings };
    } catch (error) {
        console.error('Failed to read communication settings:', error);
        return { success: false, error: 'Could not load settings.' };
    }
}

export async function saveCommunicationSettings(data: typeof defaultSettings) {
    try {
        // In a real app, you would add validation here (e.g., using Zod).
        await writeSettings(data);
        return { success: true };
    } catch (error) {
        console.error('Failed to save communication settings:', error);
        return { success: false, error: 'Failed to save settings.' };
    }
}
