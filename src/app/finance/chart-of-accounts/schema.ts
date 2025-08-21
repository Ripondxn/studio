
import { z } from 'zod';

export const accountSchema = z.object({
  code: z.string().min(1, 'Account code is required.'),
  name: z.string().min(1, 'Account name is required.'),
  type: z.enum(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense', 'Header']),
  status: z.enum(['Active', 'Inactive']),
  balance: z.number(),
  isGroup: z.boolean(),
  parentCode: z.string().optional(),
});

export type Account = z.infer<typeof accountSchema>;
