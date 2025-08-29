
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { generateInvoices } from '@/app/api/cron/generate-invoices/route';


export type WorkflowSettings = {
    approvalProcessEnabled: boolean;
    automaticInvoiceGenerationEnabled: boolean;
};

const settingsFilePath = path.join(process.cwd(), 'src/app/admin/workflow-settings/settings.json');

const defaultSettings: WorkflowSettings = {
    approvalProcessEnabled: true, // Default to enabled for security
    automaticInvoiceGenerationEnabled: true,
};

export async function getWorkflowSettings(): Promise<WorkflowSettings> {
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

export async function saveWorkflowSettings(data: WorkflowSettings) {
    try {
        await fs.writeFile(settingsFilePath, JSON.stringify(data, null, 2), 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Failed to save workflow settings:', error);
        return { success: false, error: 'Failed to save settings.' };
    }
}

export async function runInvoiceGeneration() {
    try {
        const result = await generateInvoices();
        return result;
    } catch (error) {
        console.error('Manual invoice generation failed:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}
