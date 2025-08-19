
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { userRoleSchema, UserRole } from './schema';
import { revalidatePath } from 'next/cache';


const usersFilePath = path.join(process.cwd(), 'src/app/admin/user-roles/users.json');

async function readUsers(): Promise<UserRole[]> {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // Return empty array if file doesn't exist
        }
        throw error;
    }
}

async function writeUsers(data: UserRole[]) {
    await fs.writeFile(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getUsers() {
    return await readUsers();
}

const addUserFormSchema = userRoleSchema.omit({ id: true, lastLogin: true });

export async function addUser(userData: z.infer<typeof addUserFormSchema>) {
    const validation = addUserFormSchema.safeParse(userData);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allUsers = await readUsers();

        const userExists = allUsers.some(u => u.email === userData.email);
        if (userExists) {
            return { success: false, error: `User with email "${userData.email}" already exists.` };
        }

        const newUser: UserRole = {
            ...userData,
            id: `USR-${Date.now()}`,
            lastLogin: new Date().toISOString(),
        };

        allUsers.push(newUser);
        await writeUsers(allUsers);
        
        revalidatePath('/admin/user-roles');
        return { success: true, data: newUser };

    } catch (error) {
        console.error('Failed to add user:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


const updateUserFormSchema = userRoleSchema.omit({ lastLogin: true });

export async function updateUser(userData: z.infer<typeof updateUserFormSchema>) {
    const validation = updateUserFormSchema.safeParse(userData);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const { id, ...dataToUpdate } = validation.data;

    try {
        const allUsers = await readUsers();

        const userIndex = allUsers.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return { success: false, error: 'User not found.' };
        }
        
        // Check if email is being changed to one that already exists
        if (dataToUpdate.email !== allUsers[userIndex].email) {
            const emailExists = allUsers.some((u, index) => index !== userIndex && u.email === dataToUpdate.email);
            if(emailExists){
                return { success: false, error: `Another user with email "${dataToUpdate.email}" already exists.` };
            }
        }
        
        allUsers[userIndex] = { ...allUsers[userIndex], ...dataToUpdate };
        
        await writeUsers(allUsers);
        
        revalidatePath('/admin/user-roles');
        return { success: true, data: allUsers[userIndex] };

    } catch (error) {
        console.error('Failed to update user:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function deleteUser(userId: string) {
    try {
        const allUsers = await readUsers();
        const updatedUsers = allUsers.filter(u => u.id !== userId);

        if (allUsers.length === updatedUsers.length) {
            return { success: false, error: 'User not found.' };
        }
        
        await writeUsers(updatedUsers);
        revalidatePath('/admin/user-roles');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete user:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
