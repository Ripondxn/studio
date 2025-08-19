
import { z } from 'zod';

export const accountSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.enum(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense', 'Header']),
  status: z.enum(['Active', 'Inactive']),
  balance: z.number(),
  isGroup: z.boolean(),
  parentCode: z.string().optional(),
});

export type Account = z.infer<typeof accountSchema>;
