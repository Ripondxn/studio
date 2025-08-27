

import { z } from 'zod';

export const storeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Store name is required.'),
  location: z.string().optional(),
});

export const stockItemSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  productId: z.string(),
  quantity: z.number().min(0),
  // These are added dynamically
  itemName: z.string().optional(),
  itemCode: z.string().optional(),
});

export const stockTransactionSchema = z.object({
    id: z.string(),
    date: z.string(),
    storeId: z.string(),
    storeName: z.string(),
    productId: z.string(),
    productName: z.string(),
    quantity: z.number(),
    type: z.enum(['IN', 'OUT']),
    notes: z.string().optional(),
    jobId: z.string().optional(),
});


export type Store = z.infer<typeof storeSchema>;
export type StockItem = z.infer<typeof stockItemSchema>;
export type StockTransaction = z.infer<typeof stockTransactionSchema>;
export type Product = z.infer<typeof productSchema>;
