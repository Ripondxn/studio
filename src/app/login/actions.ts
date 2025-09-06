
'use server';

import { z } from 'zod';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function handleLogin(credentials: z.infer<typeof loginSchema>) {
  const validation = loginSchema.safeParse(credentials);

  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  const { email, password } = validation.data;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Here you can fetch additional user data from your database if needed
    const userProfile = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || 'Anonymous',
      // Add other user properties as needed
    };

    return { success: true, data: userProfile };

  } catch (error: any) {
    console.error('Login error:', error);
    let errorMessage = 'An unexpected error occurred during login.';

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Your account is inactive. Please contact an administrator.';
        break;
    }

    return { success: false, error: errorMessage };
  }
}
