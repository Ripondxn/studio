
import { z } from 'zod';

export const attachmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  file: z.string().nullable(),
  remarks: z.string(),
  isLink: z.boolean()
});

export const landlordSchema = z.object({
  id: z.string().optional(), // ID is optional as it's generated on the server
  code: z.string().min(1, "Code is required."),
  name: z.string().min(1, "Name is required."),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  iban: z.string().optional(),
  attachments: z.array(attachmentSchema).optional(),
});

export type Landlord = z.infer<typeof landlordSchema>;
