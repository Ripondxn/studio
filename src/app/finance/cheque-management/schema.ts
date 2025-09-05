
import { z } from 'zod';

// Schema for individual cheques
export const chequeSchema = z.object({
  id: z.string(),
  type: z.enum(['Incoming', 'Outgoing']),
  party: z.string(),
  bankName: z.string(),
  chequeNo: z.string(),
  dueDate: z.string(),
  amount: z.number(),
  status: z.enum(['In Hand', 'Deposited', 'Cleared', 'Returned', 'Cancelled']),
});

export const chequeBookSchema = z.object({
    id: z.string(),
    bankName: z.string(),
    bookNo: z.string(),
    chequeStartNo: z.number(),
    chequeEndNo: z.number(),
    noOfLeafs: z.number(),
    leafsUsed: z.number().optional().default(0),
    status: z.enum(['Active', 'Finished', 'Cancelled']),
});

export const chequeLeafSchema = z.object({
    chequeNo: z.string(),
    bookNo: z.string(),
    bankName: z.string(),
    status: z.enum(['Used', 'Unused', 'Cancelled']),
    date: z.string().optional(),
    partyName: z.string().optional(),
    property: z.string().optional(),
    unitCode: z.string().optional(),
    amount: z.number().optional(),
});

export type Cheque = z.infer<typeof chequeSchema>;
export type ChequeBook = z.infer<typeof chequeBookSchema>;
export type ChequeLeaf = z.infer<typeof chequeLeafSchema>;
