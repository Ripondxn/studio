
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { type FeaturePermission } from './permissions';
import { type UserRole } from '../user-roles/schema';

const permissionsFilePath = path.join(process.cwd(), 'src/app/admin/access-control/permissions.json');
const usersFilePath = path.join(process.cwd(), 'src/app/admin/user-roles/users.json');

async function readData(filePath: string) {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export async function getPermissions(): Promise<FeaturePermission[]> {
    return await readData(permissionsFilePath);
}

export async function savePermissions(permissions: FeaturePermission[]) {
    try {
        await fs.writeFile(permissionsFilePath, JSON.stringify(permissions, null, 2), 'utf-8');
        revalidatePath('/admin/access-control');
        return { success: true };
    } catch (error) {
        console.error('Failed to save permissions:', error);
        return { success: false, error: 'Failed to save permissions.' };
    }
}

export async function getRoles(): Promise<string[]> {
    try {
        const users: UserRole[] = await readData(usersFilePath);
        const allRoles = users.map(u => u.role);
        // Add default roles that might not be in use yet
        const defaultRoles = ['Super Admin', 'Admin', 'Property Manager', 'Accountant', 'User'];
        const uniqueRoles = Array.from(new Set([...allRoles, ...defaultRoles]));
        return uniqueRoles;
    } catch (error) {
        console.error("Failed to read user roles", error);
        return ['Super Admin', 'Admin', 'Property Manager', 'Accountant', 'User'];
    }
}
