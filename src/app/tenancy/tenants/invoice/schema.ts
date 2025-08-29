
import { z } from 'zod';
import { invoiceSchema, invoiceItemSchema } from '@/app/tenancy/customer/invoice/form-schema';

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
