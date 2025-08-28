
import { z } from 'zod';

export const chequeBookSchema = z.object({
    id: z.string(),
    bankName: z.string().min(1, "Bank name is required."),
    bookNo: z.string().min(1, "Book number is required."),
    chequeStartNo: z.coerce.number().min(1, "Starting number is required."),
    chequeEndNo: z.coerce.number().min(1, "Ending number is required."),
    noOfLeafs: z.coerce.number(),
    leafsUsed: z.coerce.number().optional().default(0),
    status: z.enum(['Active', 'Finished', 'Cancelled']),
});

export const receiptBookSchema = z.object({
    id: z.string(),
    bookNo: z.string().min(1, "Book number is required."),
    receiptStartNo: z.coerce.number().min(1, "Starting number is required."),
    receiptEndNo: z.coerce.number().min(1, "Ending number is required."),
    noOfLeafs: z.coerce.number(),
    leafsUsed: z.coerce.number().optional().default(0),
    status: z.enum(['Active', 'Finished', 'Cancelled']),
    assignedTo: z.string().optional(),
});

export const receiptLeafSchema = z.object({
    receiptNo: z.string(),
    bookNo: z.string(),
    status: z.enum(['Used', 'Unused']),
    date: z.string().optional(),
    partyCode: z.string().optional(),
    partyName: z.string().optional(),
    amount: z.number().optional(),
    collectedBy: z.string().optional(),
});


export const chequeLeafSchema = z.object({
    chequeNo: z.string(),
    bookNo: z.string(),
    bankName: z.string(),
    status: z.enum(['Used', 'Unused']),
    date: z.string().optional(),
    partyCode: z.string().optional(),
    partyName: z.string().optional(),
    amount: z.number().optional(),
});


export type ChequeBook = z.infer<typeof chequeBookSchema>;
export type ReceiptBook = z.infer<typeof receiptBookSchema>;
export type ReceiptLeaf = z.infer<typeof receiptLeafSchema>;
export type ChequeLeaf = z.infer<typeof chequeLeafSchema>;
