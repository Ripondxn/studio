
import { z } from 'zod';

export const attachmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  file: z.string().nullable(),
  remarks: z.string(),
  isLink: z.boolean()
});

export const tenantSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Code is required."),
  name: z.string().min(1, "Name is required."),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  contractNo: z.string().optional(),
  contractId: z.string().nullable().optional(),
  attachments: z.array(attachmentSchema).optional(),
});

export type Tenant = z.infer<typeof tenantSchema>;
