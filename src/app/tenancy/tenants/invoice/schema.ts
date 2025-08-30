

import { z } from 'zod';
import { invoiceSchema, invoiceItemSchema } from '@/app/tenancy/customer/invoice/schema';

// This schema is specifically for subscription invoices, which are simpler.
export const subscriptionInvoiceSchema = invoiceSchema.omit({
    subTotal: true,
    tax: true,
    taxType: true,
    taxRate: true,
}).extend({
    subTotal: z.number().optional(),
    tax: z.number().optional(),
    taxType: z.enum(['exclusive', 'inclusive']).optional(),
    taxRate: z.number().optional(),
});


export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type SubscriptionInvoice = z.infer<typeof subscriptionInvoiceSchema>;
