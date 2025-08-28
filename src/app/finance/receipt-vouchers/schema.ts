

import { z } from 'zod';

export const receiptVoucherSchema = z.object({
  id: z.string(),
  receiptNo: z.string().min(1, 'Receipt number is required.'),
  date: z.string().min(1, 'Date is required.'),
  partyType: z.enum(['Tenant', 'Customer']),
  partyName: z.string().min(1, 'Party name is required.'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than zero.'),
  paymentMethod: z.enum(['Cash', 'Cheque', 'Bank Transfer', 'Card']),
  bankAccountId: z.string().optional(),
  chequeNo: z.string().optional(),
  chequeDate: z.string().optional(),
  bankName: z.string().optional(),
  collectedBy: z.string().min(1, 'Collector is required.'),
  notes: z.string().optional(),
  createdBy: z.string(),
  invoiceId: z.string().optional(), // Link to an invoice if applicable
  contractId: z.string().optional(), // Link to a contract if applicable
  property: z.string().optional(),
  unitCode: z.string().optional(),
  roomCode: z.string().optional(),
});

export type ReceiptVoucher = z.infer<typeof receiptVoucherSchema>;


