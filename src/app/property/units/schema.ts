

import { z } from 'zod';

export const unitSchema = z.object({
  id: z.string(),
  unitCode: z.string().min(1, "Unit code is required."),
  unitName: z.string().optional(),
  propertyCode: z.string().min(1, "Property code is required."),
  unitType: z.string().min(1, "Unit type is required."),
  annualRent: z.number().min(0, "Annual rent must be a positive number.").optional(),
  unitStatus: z.enum(['Active', 'Inactive']),
  occupancyStatus: z.enum(['Vacant', 'Occupied', 'Partially Occupied']).optional(),
});

export type Unit = z.infer<typeof unitSchema>;

