
import { z } from 'zod';

export const floorSchema = z.object({
  id: z.string(),
  floorCode: z.string().min(1, "Floor code is required."),
  floorName: z.string().min(1, "Floor name is required."),
  propertyCode: z.string().min(1, "Property code is required."),
  noOfUnits: z.number().min(0, "Number of units must be 0 or more."),
  occupancyStatus: z.enum(['Fully Occupied', 'Partially Occupied', 'Vacant']).optional(),
});

export type Floor = z.infer<typeof floorSchema>;
