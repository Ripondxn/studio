
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { userRoleSchema, UserRole } from './schema';
import { revalidatePath } from 'next/cache';
import { authAdmin } from '@/lib/firebase/admin-config';
import * as admin from 'firebase-admin';

const usersFilePath = path.join(process.cwd(), 'src/app/admin/user-roles/users.json');

async function readUsers(): Promise<UserRole[]> {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
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

export async function getUserByEmail(email: string): Promise<UserRole | null> {
    const allUsers = await readUsers();
    const user = allUsers.find(u => u.email === email);
    return user || null;
}

const addUserFormSchema = userRoleSchema.omit({ id: true, lastLogin: true });

export async function addUser(userData: z.infer<typeof addUserFormSchema>, creator: { name: string }) {
    const validation = addUserFormSchema.safeParse(userData);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const { email, password, ...otherUserData } = validation.data;

        const userRecord = await authAdmin.createUser({
            email: email,
            password: password,
            disabled: otherUserData.status !== 'active'
        });

        const allUsers = await readUsers();

        const userExists = allUsers.some(u => u.email === email);
        if (userExists) {
            await authAdmin.deleteUser(userRecord.uid);
            return { success: false, error: `User with email \"${email}\" already exists.` };
        }

        const newUser: UserRole = {
            ...validation.data,
            id: userRecord.uid,
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            createdBy: creator.name,
        };

        allUsers.push(newUser);
        await writeUsers(allUsers);
        
        revalidatePath('/admin/user-roles');
        return { success: true, data: newUser };

    } catch (error: any) {
        console.error('Failed to add user:', error);
        let errorMessage = 'An unknown error occurred.';
        if (error.code === 'auth/email-already-exists') {
            errorMessage = `The email address is already in use by another account.`;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        return { success: false, error: errorMessage };
    }
}


const updateUserFormSchema = userRoleSchema.omit({ lastLogin: true }).partial();

export async function updateUser(userData: z.infer<typeof updateUserFormSchema>, modifier: { name: string }) {
    const validation = userRoleSchema.partial().safeParse(userData);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const { id, ...dataToUpdate } = validation.data;

    if (!id) {
        return { success: false, error: 'User ID is required for an update.' };
    }

    try {
        let userRecord;
        try {
            userRecord = await authAdmin.getUser(id);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                // User doesn't exist in Firebase, so let's create it.
                const { email, password, status } = dataToUpdate;
                if (!email || !password) {
                    return { success: false, error: 'Email and password are required to create a new user.' };
                }
                userRecord = await authAdmin.createUser({
                    email: email,
                    password: password,
                    disabled: status !== 'active'
                });

                // Replace old non-firebase ID with the new Firebase UID
                const allUsers = await readUsers();
                const userIndex = allUsers.findIndex(u => u.id === id);
                if(userIndex !== -1) {
                    allUsers[userIndex].id = userRecord.uid;
                    await writeUsers(allUsers);
                }
                
            } else {
                throw error; // Re-throw other Firebase errors
            }
        }

        const allUsers = await readUsers();
        const userIndex = allUsers.findIndex(u => u.id === userRecord.uid || u.id === id);

        if (userIndex === -1) {
            return { success: false, error: 'User not found in local data.' };
        }
        
        const firebaseUpdateData: admin.auth.UpdateRequest = {};
        if (dataToUpdate.email) firebaseUpdateData.email = dataToUpdate.email;
        if (dataToUpdate.password) firebaseUpdateData.password = dataToUpdate.password;
        if (dataToUpdate.status) firebaseUpdateData.disabled = dataToUpdate.status !== 'active';

        if (Object.keys(firebaseUpdateData).length > 0) {
            await authAdmin.updateUser(userRecord.uid, firebaseUpdateData);
        }
        
        if (!dataToUpdate.password) {
            dataToUpdate.password = allUsers[userIndex].password;
        }
        
        allUsers[userIndex] = { 
            ...allUsers[userIndex], 
            ...dataToUpdate,
            id: userRecord.uid, // Ensure ID is the Firebase UID
            modifiedAt: new Date().toISOString(),
            modifiedBy: modifier.name,
        };
        
        await writeUsers(allUsers);
        
        revalidatePath('/admin/user-roles');
        return { success: true, data: allUsers[userIndex] };

    } catch (error: any) {
        console.error('Failed to update user:', error);
        let errorMessage = (error as Error).message || 'An unknown error occurred.';
        if (error.code === 'auth/email-already-exists') {
            errorMessage = 'The new email is already in use by another account.';
        }
        return { success: false, error: errorMessage };
    }
}


export async function deleteUser(userId: string) {
    try {
        // First, try to delete from Firebase
        try {
             await authAdmin.deleteUser(userId);
        } catch(error: any) {
            if (error.code !== 'auth/user-not-found') {
                throw error; // re-throw if it's not a 'user-not-found' error
            }
            // if user is not in firebase, we can ignore the error and proceed to delete from local data
        }
        
        const allUsers = await readUsers();
        const updatedUsers = allUsers.filter(u => u.id !== userId);

        if (allUsers.length === updatedUsers.length) {
            return { success: false, error: 'User not found in local data.' };
        }
        
        await writeUsers(updatedUsers);
        revalidatePath('/admin/user-roles');
        return { success: true, message: 'User successfully deleted.' };

    } catch (error: any) {
        console.error('Failed to delete user:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
