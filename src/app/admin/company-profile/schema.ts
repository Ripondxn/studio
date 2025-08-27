
import { z } from 'zod';

export const companyProfileSchema = z.object({
  name: z.string().min(1, 'Company name is required.'),
  address: z.string().min(1, 'Address is required.'),
  email: z.string().email('Invalid email address.'),
  poBox: z.string().optional(),
  licenseNo: z.string().optional(),
  vatNo: z.string().optional(),
  logo: z.string().nullable().optional(), // Stored as base64 string
});

export type CompanyProfile = z.infer<typeof companyProfileSchema>;
