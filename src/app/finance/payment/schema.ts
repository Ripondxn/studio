
import { z } from 'zod';

export const paymentSchema = z.object({
  id: z.string(),
  type: z.enum(['Receipt', 'Payment']),
  date: z.string().min(1, "Date is required."),
  partyType: z.enum(['Tenant', 'Landlord', 'Vendor', 'Customer']),
  partyName: z.string().min(1, "Party name is required."),
  amount: z.number().min(0.01, "Amount must be greater than 0."),
  paymentMethod: z.enum(['Cash', 'Cheque', 'Bank Transfer', 'Card']),
  paymentFrom: z.enum(['Bank', 'Petty Cash']).optional(),
  bankAccountId: z.string().optional(),
  referenceNo: z.string().optional(),
  contractNo: z.string().optional(),
  property: z.string().optional(),
  remarks: z.string().optional(),
  status: z.enum(['Paid', 'Received', 'Cancelled']),
});

export type Payment = z.infer<typeof paymentSchema>;
