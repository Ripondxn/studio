
"use server";

import { promises as fs } from 'fs';
import { revalidatePath } from 'next/cache';
import { type Permission } from './schema';
import path from 'path';

const permissionsFilePath = path.join(process.cwd(), 'src', 'app', 'admin', 'access-control', 'permissions.json');

export async function savePermissions(newPermissions: Permission) {
    try {
        const fileContent = await fs.readFile(permissionsFilePath, 'utf-8');
        const allPermissions: Permission[] = JSON.parse(fileContent);

        const index = allPermissions.findIndex(p => p.moduleId === newPermissions.moduleId);

        if (index !== -1) {
            allPermissions[index] = newPermissions;
        } else {
            allPermissions.push(newPermissions);
        }

        await fs.writeFile(permissionsFilePath, JSON.stringify(allPermissions, null, 2), 'utf-8');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Failed to save permissions:', error);
        return { success: false, error: 'Failed to save permissions.' };
    }
}
