
'use server';

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
}).refine(data => data.chequeEndNo >= data.chequeStartNo, {
    message: "Ending number must be greater than or equal to the starting number.",
    path: ["chequeEndNo"],
});

export const receiptBookSchema = z.object({
    id: z.string(),
    bookNo: z.string().min(1, "Book number is required."),
    receiptStartNo: z.coerce.number().min(1, "Starting number is required."),
    receiptEndNo: z.coerce.number().min(1, "Ending number is required."),
    noOfLeafs: z.coerce.number(),
    leafsUsed: z.coerce.number().optional().default(0),
    status: z.enum(['Active', 'Finished', 'Cancelled']),
});

export type ChequeBook = z.infer<typeof chequeBookSchema>;
export type ReceiptBook = z.infer<typeof receiptBookSchema>;
