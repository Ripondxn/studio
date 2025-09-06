
"use server";

import { promises as fs } from 'fs';
import { revalidatePath } from 'next/cache';
import { type UserOverride } from './schema';
import path from 'path';

const userOverridesFilePath = path.join(process.cwd(), 'src', 'app', 'admin', 'access-control', 'user-overrides.json');

export async function saveUserOverrides(overrides: UserOverride[]) {
    try {
        await fs.writeFile(userOverridesFilePath, JSON.stringify(overrides, null, 2), 'utf-8');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Failed to save user overrides:', error);
        return { success: false, error: 'Failed to save user overrides.' };
    }
}
