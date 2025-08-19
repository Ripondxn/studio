
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { UserRole } from '@/app/admin/user-roles/schema';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

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

export async function handleLogin(credentials: z.infer<typeof loginSchema>) {
  const validation = loginSchema.safeParse(credentials);

  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { email, password } = validation.data;

  try {
    const allUsers = await readUsers();
    const user = allUsers.find(u => u.email === email);

    if (user) {
      if (user.password === password) {
        if(user.status === 'Active') {
          // WARNING: In a real app, do not send sensitive data like this.
          // This is simplified for demonstration purposes.
          const { password, ...userProfile } = user;
          return { success: true, data: userProfile };
        } else {
          return { success: false, error: 'Your account is inactive. Please contact an administrator.' };
        }
      } else {
         return { success: false, error: 'Invalid email or password.' };
      }
    } else {
      return { success: false, error: 'Invalid email or password.' };
    }
  } catch (error) {
     console.error('Login error:', error);
     return { success: false, error: 'An unexpected error occurred during login.' };
  }
}
