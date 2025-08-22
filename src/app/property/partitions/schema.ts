

import { z } from 'zod';

export const partitionSchema = z.object({
  id: z.string(),
  partitionCode: z.string().min(1, "Partition code is required."),
  partitionName: z.string().optional(),
  propertyCode: z.string().min(1, "Property code is required."),
  unitCode: z.string().min(1, "Unit code is required."),
  floorCode: z.string().optional(),
  roomCode: z.string().optional(),
  monthlyRent: z.number().optional(),
  status: z.enum(['Active', 'Inactive']).optional(),
  occupancyStatus: z.enum(['Vacant', 'Occupied']).optional(),
});

export type Partition = z.infer<typeof partitionSchema>;
