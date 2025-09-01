
import { z } from 'zod';

export const utilityAccountSchema = z.object({
  id: z.string(),
  utilityType: z.enum(['Water & Electricity', 'Internet', 'Telephone']),
  provider: z.string().min(1, 'Provider is required.'),
  accountNumber: z.string().min(1, 'Account number is required.'),
  propertyCode: z.string().min(1, 'A property must be linked.'),
  unitCode: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
  notes: z.string().optional(),
  totalPaid: z.number().optional().default(0),
});

export type UtilityAccount = z.infer<typeof utilityAccountSchema>;
