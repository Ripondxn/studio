

import { z } from 'zod';

export const invoiceAllocationSchema = z.object({
  invoiceId: z.string(),
  amount: z.number(),
});

export const paymentSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['Receipt', 'Payment']),
  date: z.string().min(1, "Date is required."),
  partyType: z.enum(['Tenant', 'Landlord', 'Vendor', 'Customer']),
  partyName: z.string().min(1, "Party name is required."),
  amount: z.number().min(0.01, "Amount must be greater than 0."),
  paymentMethod: z.enum(['Cash', 'Cheque', 'Bank Transfer', 'Card']),
  paymentFrom: z.enum(['Bank', 'Petty Cash']).default('Bank'),
  bankAccountId: z.string().optional(),
  property: z.string().optional(),
  unitCode: z.string().optional(),
  floor: z.string().optional(),
  roomCode: z.string().optional(),
  partitionCode: z.string().optional(),
  referenceType: z.string().optional(),
  referenceNo: z.string().optional(),
  description: z.string().optional(),
  contractNo: z.string().optional(),
  remarks: z.string().optional(),
  status: z.enum(['Paid', 'Received', 'Cancelled']),
  agentCode: z.string().optional(),
  invoiceAllocations: z.array(invoiceAllocationSchema).optional(),
});

export type Payment = z.infer<typeof paymentSchema>;
