import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  itemCode: z.string().min(1, 'Item code is required.'),
  itemName: z.string().min(1, 'Item name is required.'),
  itemType: z.enum(['Product', 'Service']),
  salePrice: z.number().min(0, 'Sale price must be a positive number.'),
  costPrice: z.number().min(0, 'Cost price must be a positive number.'),
});

export type Product = z.infer<typeof productSchema>;
