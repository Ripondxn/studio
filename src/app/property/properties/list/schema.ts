
import { z } from 'zod';

export const attachmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  file: z.string().nullable(),
  remarks: z.string(),
  isLink: z.boolean()
});

export const propertySchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  propertyType: z.string(),
  status: z.string(),
  noOfUnits: z.string(),
  attachments: z.array(attachmentSchema).optional(),
});

export type Property = z.infer<typeof propertySchema>;
