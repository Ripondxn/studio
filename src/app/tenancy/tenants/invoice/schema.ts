

import { z } from 'zod';

export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required.'),
  quantity: z.number().min(1, 'Quantity must be at least 1.'),
  unitPrice: z.number().min(0, 'Unit price must be positive.'),
  total: z.number(),
});

export const invoiceSchema = z.object({
  id: z.string(),
  invoiceNo: z.string().min(1, 'Invoice number is required.'),
  customerCode: z.string().min(1, 'Customer is required.'),
  customerName: z.string().min(1, 'Customer name is required.'),
  property: z.string().optional(),
  unitCode: z.string().optional(),
  roomCode: z.string().optional(),
  invoiceDate: z.string().min(1, 'Invoice date is required.'),
  dueDate: z.string().min(1, 'Due date is required.'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required.'),
  subTotal: z.number(),
  taxType: z.enum(['exclusive', 'inclusive']).default('exclusive'),
  taxRate: z.number().optional().default(0),
  tax: z.number(),
  total: z.number(),
  amountPaid: z.number().optional().default(0),
  remainingBalance: z.number().optional(),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled']),
  notes: z.string().optional(),
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
