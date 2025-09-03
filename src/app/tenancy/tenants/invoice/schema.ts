
import { z } from 'zod';
import { invoiceSchema, invoiceItemSchema } from '@/app/tenancy/customer/invoice/schema';

// This schema is for validating the incoming data for a subscription invoice.
// We omit server-generated or calculated fields.
export const subscriptionInvoiceSchema = invoiceSchema.omit({
    id: true,
    amountPaid: true,
    remainingBalance: true,
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type SubscriptionInvoice = z.infer<typeof subscriptionInvoiceSchema>;
