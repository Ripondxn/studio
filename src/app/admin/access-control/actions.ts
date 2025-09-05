
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { type FeaturePermission, featurePermissions } from './permissions';
import { type UserRole } from '../user-roles/schema';
import { type ModuleSettings } from './schema';

const permissionsFilePath = path.join(process.cwd(), 'src/app/admin/access-control/permissions.json');
const usersFilePath = path.join(process.cwd(), 'src/app/admin/user-roles/users.json');
const moduleSettingsFilePath = path.join(process.cwd(), 'src/app/admin/access-control/module-settings.json');
const userOverridesFilePath = path.join(process.cwd(), 'src/app/admin/access-control/user-overrides.json');

async function readData(filePath: string) {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // Return a default structure that can be safely merged
            if (filePath.endsWith('permissions.json')) return [];
            if (filePath.endsWith('users.json')) return [];
            if (filePath.endsWith('module-settings.json')) return { modules: [] }; 
            if (filePath.endsWith('user-overrides.json')) return [];
            return [];
        }
        throw error;
    }
}

export async function getPermissions(): Promise<FeaturePermission[]> {
     const savedPermissions = await readData(permissionsFilePath);
     // Merge saved permissions with the default structure to ensure all features are listed
    const allPermissions = featurePermissions.map(feature => {
        const savedFeature = savedPermissions.find((p: any) => p.feature === feature.feature);
        const actions = feature.actions.map(action => {
        const savedAction = savedFeature?.actions.find((a: any) => a.action === action.action);
        return {
            ...action,
            allowedRoles: savedAction ? savedAction.allowedRoles : action.allowedRoles,
        };
        });
        return {
        ...feature,
        actions,
        };
    });
    return allPermissions;
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

export async function updatePermission(featureName: string, actionName: string, role: string, isChecked: boolean) {
    const currentPermissions = await getPermissions();
    const feature = currentPermissions.find(f => f.feature === featureName);
    if (feature) {
        const action = feature.actions.find(a => a.action === actionName);
        if (action) {
            if (isChecked) {
                if (!action.allowedRoles.includes(role)) {
                    action.allowedRoles.push(role);
                }
            } else {
                action.allowedRoles = action.allowedRoles.filter(r => r !== role);
            }
        }
    }
    return await savePermissions(currentPermissions);
}


export async function getRoles(): Promise<string[]> {
    try {
        const users: UserRole[] = await readData(usersFilePath);
        const allRoles = users.map(u => u.role);
        // Add default roles that might not be in use yet
        const defaultRoles = ['Super Admin', 'Admin', 'Property Manager', 'Accountant', 'User', 'Developer'];
        const uniqueRoles = Array.from(new Set([...allRoles, ...defaultRoles]));
        return uniqueRoles;
    } catch (error) {
        console.error("Failed to read user roles", error);
        return ['Super Admin', 'Admin', 'Property Manager', 'Accountant', 'User', 'Developer'];
    }
}

export type UserOverride = {
    email: string;
    allowedModules: string[];
}

export async function getUserOverrides(): Promise<UserOverride[]> {
    return (await readData(userOverridesFilePath)) as UserOverride[];
}

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


export async function getCombinedAccessControlData() {
    try {
        const [permissions, moduleSettings, userOverrides] = await Promise.all([
            getPermissions(),
            readData(moduleSettingsFilePath) as Promise<ModuleSettings>,
            getUserOverrides()
        ]);
        return { success: true, permissions, moduleSettings, userOverrides };
    } catch(error) {
        return { success: false, error: (error as Error).message };
    }
}
