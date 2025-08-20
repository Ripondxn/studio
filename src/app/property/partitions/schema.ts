
import { z } from 'zod';

export const partitionSchema = z.object({
  id: z.string(),
  partitionCode: z.string().min(1, "Partition code is required."),
  partitionName: z.string().min(1, "Partition name is required."),
  propertyCode: z.string().min(1, "Property code is required."),
  unitCode: z.string().min(1, "Unit code is required."),
  monthlyRent: z.number().min(0, "Monthly rent must be 0 or more."),
  status: z.enum(['Active', 'Inactive']),
});

export type Partition = z.infer<typeof partitionSchema>;
