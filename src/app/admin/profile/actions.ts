'use server';

import { promises as fs } from 'fs';
import path from 'path';

// Note: In a real app, this would be a database call.
const profileDataPath = path.join(process.cwd(), 'src/app/admin/profile/data.json');

async function getProfileData() {
    try {
        const data = await fs.readFile(profileDataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return a default structure
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@propvue.com',
                phone: '+1 (123) 456-7890',
            };
        }
        throw error;
    }
}

async function saveProfileData(data: any) {
    // In a real app, you'd add validation and proper error handling.
    // For this example, we'll just write to the file.
    // We are not saving passwords in this example.
    const { currentPassword, newPassword, ...profileData } = data;
    await fs.writeFile(profileDataPath, JSON.stringify(profileData, null, 2), 'utf-8');
}


export async function updateUserProfile(formData: FormData) {
  const data = Object.fromEntries(formData);
  
  // Basic validation (in a real app, use Zod)
  if (!data.firstName || !data.lastName || !data.email) {
    return { success: false, error: 'Name and email are required.' };
  }

  // Password change logic (placeholder)
  if (data.newPassword && !data.currentPassword) {
    return { success: false, error: 'Current password is required to set a new one.' };
  }

  if (data.newPassword && data.currentPassword) {
     console.log('Password change requested. In a real app, you would verify the current password and hash the new one.');
  }

  try {
    await saveProfileData(data);
    return { success: true };
  } catch (error) {
    console.error('Failed to save profile:', error);
    return { success: false, error: 'Failed to save profile data.' };
  }
}

export async function loadUserProfile() {
    try {
        const data = await getProfileData();
        return { success: true, data };
    } catch (error) {
        console.error('Failed to load profile:', error);
        return { success: false, error: 'Could not load profile data.' };
    }
}
