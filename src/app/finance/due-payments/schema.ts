
import { z } from 'zod';

export const duePaymentSchema = z.object({
  id: z.string(),
  partyType: z.enum(['Tenant', 'Landlord']),
  partyName: z.string(),
  type: z.enum(['Receivable', 'Payable']),
  property: z.string().optional(),
  contractNo: z.string(),
  dueDate: z.string(),
  amount: z.number(),
  status: z.enum(['Upcoming', 'Due Soon', 'Overdue', 'Paid']),
});

export type DuePayment = z.infer<typeof duePaymentSchema>;
