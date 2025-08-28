
import { z } from 'zod';

export const userRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
  role: z.enum(['User', 'Admin', 'Super Admin', 'Property Manager', 'Accountant', 'Developer']),
  status: z.enum(['Active', 'Inactive']),
  lastLogin: z.string(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  modifiedAt: z.string().optional(),
  modifiedBy: z.string().optional(),
});

export type UserRole = z.infer<typeof userRoleSchema>;
