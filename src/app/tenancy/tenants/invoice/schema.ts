

import { z } from 'zod';
import { invoiceSchema, invoiceItemSchema } from '@/app/tenancy/customer/invoice/schema';

// This schema is specifically for subscription invoices, which are simpler.
export const subscriptionInvoiceSchema = invoiceSchema.omit({
    // We omit fields that are calculated automatically or not relevant to the core data
}).extend({
    // We can add any subscription-specific overrides here if needed in the future.
    // For now, it inherits all fields from the base invoice schema, which is what we want.
});


export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type SubscriptionInvoice = z.infer<typeof subscriptionInvoiceSchema>;

