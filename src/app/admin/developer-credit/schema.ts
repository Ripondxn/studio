
import { z } from 'zod';

export const developerProfileSchema = z.object({
  name: z.string().min(1, 'Developer name is required.'),
  email: z.string().email('Invalid email address.'),
  website: z.string().url('Invalid URL.').or(z.literal('')),
  bio: z.string().optional(),
  avatar: z.string().nullable().optional(), // Stored as base64 string
});

export type DeveloperProfile = z.infer<typeof developerProfileSchema>;
