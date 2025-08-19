
'use server';

import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// This is a mock login function. In a real application, you would:
// 1. Validate the user's credentials against a database.
// 2. Use a library like 'bcrypt' to compare hashed passwords.
// 3. Create a session for the user (e.g., using JWTs or server-side sessions).
// 4. Set a cookie or token to maintain the user's logged-in state.

export async function handleLogin(credentials: z.infer<typeof loginSchema>) {
  const validation = loginSchema.safeParse(credentials);

  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { email, password } = validation.data;

  // Mock user data - in a real app, this would come from your database
  const validEmail = 'admin@propvue.com';
  const validPassword = 'password123';

  if (email === validEmail && password === validPassword) {
    // In a real app, you would generate and return a session token here
    return { success: true };
  } else {
    return { success: false, error: 'Invalid email or password.' };
  }
}
