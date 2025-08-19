
import { z } from 'zod';

export const unitSchema = z.object({
  id: z.string(),
  unitCode: z.string(),
  property: z.string(),
  floor: z.string(),
  unitType: z.string(),
  annualRent: z.string(),
  unitStatus: z.string(),
});

export type Unit = z.infer<typeof unitSchema>;
