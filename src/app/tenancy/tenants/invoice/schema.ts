import { z } from 'zod';
import { invoiceSchema, invoiceItemSchema } from '@/app/tenancy/customer/invoice/schema';

export const subscriptionInvoiceSchema = invoiceSchema.omit({ 
    taxType: true,
    taxRate: true,
    tax: true,
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export { invoiceSchema };
