
import { z } from 'zod';

export const chequeSchema = z.object({
  id: z.string(),
  chequeNo: z.string().min(1, "Cheque number is required."),
  chequeDate: z.string().min(1, "Cheque date is required."),
  amount: z.number().min(0.01, "Amount must be greater than 0."),
  bankName: z.string().min(1, "Bank name is required."),
  status: z.enum(['In Hand', 'Deposited', 'Cleared', 'Bounced', 'Cancelled', 'Returned', 'Returned with Cash']),
  type: z.enum(['Incoming', 'Outgoing']),
  partyType: z.enum(['Tenant', 'Landlord', 'Customer', 'Vendor', 'Agent']),
  partyName: z.string().min(1, "Party name is required."),
  property: z.string().optional(),
  unitCode: z.string().optional(),
  roomCode: z.string().optional(),
  contractNo: z.string().optional(),
  remarks: z.string().optional(),
  depositDate: z.string().optional(), // Date it was actually deposited
  clearanceDate: z.string().optional(), // Date it cleared or bounced
  bankAccountId: z.string().optional(), // The bank account it was deposited into
});

export type Cheque = z.infer<typeof chequeSchema>;
