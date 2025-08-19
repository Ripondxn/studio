
import { z } from 'zod';

export const propertySchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  propertyType: z.string(),
  status: z.string(),
  noOfUnits: z.string(),
});

export type Property = z.infer<typeof propertySchema>;

    