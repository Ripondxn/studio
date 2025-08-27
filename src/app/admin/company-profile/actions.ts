
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { companyProfileSchema, type CompanyProfile } from './schema';


const profileDataPath = path.join(process.cwd(), 'src/app/admin/company-profile/data.json');

const defaultProfile: CompanyProfile = {
    name: 'Trust Famous Real Estate',
    address: 'Your Company Address, City, Country',
    email: 'info@yourcompany.com',
    poBox: '12345',
    licenseNo: 'LIC-123456',
    vatNo: 'VAT-1234567890',
    logo: null,
};

export async function getCompanyProfile(): Promise<CompanyProfile> {
    try {
        await fs.access(profileDataPath);
        const data = await fs.readFile(profileDataPath, 'utf-8');
        return { ...defaultProfile, ...JSON.parse(data) };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // Create the file with default data if it doesn't exist
            await fs.writeFile(profileDataPath, JSON.stringify(defaultProfile, null, 2), 'utf-8');
            return defaultProfile;
        }
        throw error;
    }
}

export async function saveCompanyProfile(data: CompanyProfile) {
    const validation = companyProfileSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.errors[0].message };
    }

    try {
        await fs.writeFile(profileDataPath, JSON.stringify(validation.data, null, 2), 'utf-8');
        // Revalidate the entire site to ensure the context is updated everywhere
        revalidatePath('/', 'layout'); 
        return { success: true };
    } catch (error) {
        console.error('Failed to save company profile:', error);
        return { success: false, error: 'Failed to save settings.' };
    }
}
