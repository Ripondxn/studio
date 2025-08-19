
import { z } from 'zod';

export const userRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['User', 'Admin', 'Super Admin', 'Property Manager', 'Accountant']),
  status: z.enum(['Active', 'Inactive']),
  lastLogin: z.string(),
});

export type UserRole = z.infer<typeof userRoleSchema>;

    