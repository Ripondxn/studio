'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const settingsFilePath = path.join(process.cwd(), 'src/app/admin/payment-gateway/settings.json');

const paymentGatewaySettingsSchema = z.object({
    ziinaApiKey: z.string().optional(),
});

type PaymentGatewaySettings = z.infer<typeof paymentGatewaySettingsSchema>;

const defaultSettings: PaymentGatewaySettings = {
    ziinaApiKey: '',
};

export async function getPaymentGatewaySettings(): Promise<PaymentGatewaySettings> {
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

export async function savePaymentGatewaySettings(data: PaymentGatewaySettings) {
    const validation = paymentGatewaySettingsSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.errors[0].message };
    }

    try {
        await fs.writeFile(settingsFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Failed to save payment gateway settings:', error);
        return { success: false, error: 'Failed to save settings.' };
    }
}
