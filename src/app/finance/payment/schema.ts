

import { z } from 'zod';
import { type Role } from '@/app/workflow/types';

export const invoiceAllocationSchema = z.object({
  invoiceId: z.string(),
  amount: z.number(),
});

export const billAllocationSchema = z.object({
  billId: z.string(),
  amount: z.number(),
});

export const approvalHistorySchema = z.object({
  action: z.string(),
  actorId: z.string(),
  actorRole: z.string(), 
  timestamp: z.string(),
  comments: z.string().optional(),
});

export const paymentSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['Receipt', 'Payment']),
  date: z.string().min(1, "Date is required."),
  partyType: z.enum(['Tenant', 'Landlord', 'Vendor', 'Customer', 'Agent']),
  partyName: z.string().min(1, "Party name is required."),
  amount: z.number().min(0.01, "Amount must be greater than 0."),
  paymentMethod: z.enum(['Cash', 'Cheque', 'Bank Transfer', 'Card']),
  paymentFrom: z.enum(['Bank', 'Petty Cash']).default('Bank'),
  bankAccountId: z.string().optional(),
  expenseAccountId: z.string().optional(),
  maintenanceTicketId: z.string().optional(),
  utilityAccountId: z.string().optional(),
  property: z.string().optional(),
  unitCode: z.string().optional(),
  floor: z.string().optional(),
  roomCode: z.string().optional(),
  referenceType: z.string().optional(),
  referenceNo: z.string().optional(),
  description: z.string().optional(),
  contractNo: z.string().optional(),
  remarks: z.string().optional(),
  status: z.enum(['Paid', 'Received', 'Cancelled']),
  agentCode: z.string().optional(),
  createdByUser: z.string().optional(),
  invoiceAllocations: z.array(invoiceAllocationSchema).optional(),
  billAllocations: z.array(billAllocationSchema).optional(),
  currentStatus: z.enum(['DRAFT', 'PENDING_ADMIN_APPROVAL', 'PENDING_SUPER_ADMIN_APPROVAL', 'POSTED', 'REJECTED']).optional(),
  approvalHistory: z.array(approvalHistorySchema).optional(),
});

export type Payment = z.infer<typeof paymentSchema>;
