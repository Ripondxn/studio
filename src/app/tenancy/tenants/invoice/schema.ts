import { z } from 'zod';
import { invoiceSchema, invoiceItemSchema } from '@/app/tenancy/customer/invoice/schema';

// This schema is specifically for subscription invoices, which are simpler.
export const subscriptionInvoiceSchema = z.object({
  id: z.string().optional(),
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
  tax: z.number().default(0),
  taxType: z.enum(['exclusive', 'inclusive']).default('exclusive'),
  taxRate: z.number().default(0),
  total: z.number(),
  amountPaid: z.number().optional().default(0),
  remainingBalance: z.number().optional(),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled']),
  notes: z.string().optional(),
});


export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type SubscriptionInvoice = z.infer<typeof subscriptionInvoiceSchema>;
