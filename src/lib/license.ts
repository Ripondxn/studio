'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { differenceInDays, addDays, format, parseISO } from 'date-fns';

const licenseFilePath = path.join(process.cwd(), 'license.json');
const TRIAL_PERIOD_DAYS = 30;

type LicenseInfo = {
    trialStartDate: string;
};

export type LicenseStatus = {
    isActive: boolean;
    isTrial: boolean;
    daysRemaining: number;
    expiryDate: string;
};

async function readLicenseFile(): Promise<LicenseInfo | null> {
    try {
        await fs.access(licenseFilePath);
        const data = await fs.readFile(licenseFilePath, 'utf-8');
        // Basic validation in case the file is empty or corrupted
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        return null; // File doesn't exist or is unreadable
    }
}

async function createLicenseFile(): Promise<LicenseInfo> {
    const trialStartDate = new Date().toISOString();
    const newLicense: LicenseInfo = { trialStartDate };
    await fs.writeFile(licenseFilePath, JSON.stringify(newLicense, null, 2), 'utf-8');
    return newLicense;
}

export async function checkLicenseStatus(): Promise<LicenseStatus> {
    let license = await readLicenseFile();

    if (!license) {
        license = await createLicenseFile();
    }
    
    const startDate = parseISO(license.trialStartDate);
    const now = new Date();
    const expiryDate = addDays(startDate, TRIAL_PERIOD_DAYS);
    const daysRemaining = differenceInDays(expiryDate, now);

    const isActive = daysRemaining >= 0;

    return {
        isActive,
        isTrial: true, // For now, we only have a trial license
        daysRemaining: Math.max(0, daysRemaining),
        expiryDate: format(expiryDate, 'PPP'),
    };
}
