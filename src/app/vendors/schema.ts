
import { z } from 'zod';

export const vendorSchema = z.object({
  id: z.string().optional(), // ID is optional as it's generated on the server
  code: z.string().min(1, "Code is required."),
  name: z.string().min(1, "Name is required."),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  iban: z.string().optional(),
});

export type Vendor = z.infer<typeof vendorSchema>;
