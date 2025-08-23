

import { z } from 'zod';

export const invoiceAllocationSchema = z.object({
  invoiceId: z.string(),
  amount: z.number(),
});

export const paymentSchema = z.object({
  id: z.string(),
  type: z.enum(['Receipt', 'Payment', 'Refund', 'Adjustment']),
  date: z.string().min(1, "Date is required."),
  partyType: z.enum(['Tenant', 'Landlord', 'Vendor', 'Customer', 'Contractor']),
  partyName: z.string().min(1, "Party name is required."),
  amount: z.number().min(0.01, "Amount must be greater than 0."),
  paymentMethod: z.enum(['Cash', 'Cheque', 'Bank Transfer', 'Card', 'Online Payment']),
  paymentFrom: z.enum(['Bank', 'Petty Cash']).optional(),
  bankAccountId: z.string().optional(),
  property: z.string().optional(),
  unitCode: z.string().optional(),
  floor: z.string().optional(),
  roomCode: z.string().optional(),
  partitionCode: z.string().optional(),
  referenceType: z.enum(['Invoice', 'Tenancy Contract', 'Lease Contract', 'Utility Bill', 'Maintenance Bill', 'Other']).optional(),
  referenceNo: z.string().optional(),
  description: z.string().optional(),
  contractNo: z.string().optional(),
  remarks: z.string().optional(),
  status: z.enum(['Paid', 'Received', 'Cancelled']),
  agentCode: z.string().optional(),
  invoiceAllocations: z.array(invoiceAllocationSchema).optional(),
});

export type Payment = z.infer<typeof paymentSchema>;
