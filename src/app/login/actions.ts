
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


// This is a mock login function. In a real application, you would:
// 1. Use a library like 'bcrypt' to HASH passwords before storing and compare hashes during login.
// 2. Create a secure session for the user (e.g., using JWTs or server-side sessions).
// 3. Set a cookie or token to maintain the user's logged-in state.
// 4. Implement route protection middleware.

// WARNING: THIS IS NOT A SECURE LOGIN SYSTEM. IT IS FOR DEMONSTRATION PURPOSES ONLY.
// PASSWORDS ARE STORED AND CHECKED IN PLAIN TEXT.

export async function handleLogin(credentials: z.infer<typeof loginSchema>) {
  const validation = loginSchema.safeParse(credentials);

  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { email, password } = validation.data;

  try {
    const allUsers = await readUsers();
    const user = allUsers.find(u => u.email === email);

    if (user) {
      if (user.password === password) {
        if(user.status === 'Active') {
          // In a real app, you would generate and return a session token here
          return { success: true };
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
