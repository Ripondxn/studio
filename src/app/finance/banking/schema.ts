
import { z } from 'zod';

export const bankAccountSchema = z.object({
  id: z.string(),
  accountName: z.string().min(1, 'Account name is required.'),
  bankName: z.string().min(1, 'Bank name is required.'),
  accountNumber: z.string().min(1, 'Account number is required.'),
  balance: z.number().min(0, 'Balance cannot be negative.'),
  currency: z.string().min(3, 'Currency code is required.').default('AED'),
});

export type BankAccount = z.infer<typeof bankAccountSchema>;
