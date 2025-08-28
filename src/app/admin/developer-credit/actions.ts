
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { developerProfileSchema, type DeveloperProfile } from './schema';


const profileDataPath = path.join(process.cwd(), 'src/app/admin/developer-credit/data.json');

const defaultProfile: DeveloperProfile = {
    name: 'Your Name',
    email: 'your.email@example.com',
    website: 'https://your.website.com',
    bio: 'Software developer specializing in creating amazing applications.',
    avatar: null,
};

export async function getDeveloperProfile(): Promise<DeveloperProfile> {
    try {
        await fs.access(profileDataPath);
        const data = await fs.readFile(profileDataPath, 'utf-8');
        return { ...defaultProfile, ...JSON.parse(data) };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(profileDataPath, JSON.stringify(defaultProfile, null, 2), 'utf-8');
            return defaultProfile;
        }
        throw error;
    }
}

export async function saveDeveloperProfile(data: DeveloperProfile) {
    const validation = developerProfileSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.errors[0].message };
    }

    try {
        await fs.writeFile(profileDataPath, JSON.stringify(validation.data, null, 2), 'utf-8');
        revalidatePath('/admin/developer-credit'); 
        return { success: true };
    } catch (error) {
        console.error('Failed to save developer profile:', error);
        return { success: false, error: 'Failed to save settings.' };
    }
}
