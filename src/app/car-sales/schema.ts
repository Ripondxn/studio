
import { z } from 'zod';

export const vehicleSchema = z.object({
  id: z.string(),
  stockNo: z.string(),
  make: z.string().min(1, "Vehicle make is required."),
  model: z.string().min(1, "Vehicle model is required."),
  year: z.coerce.number().min(1900, "Invalid year."),
  vin: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.number().optional(),
  sellerInfo: z.string().optional(), // Could be a vendor ID
  saleDate: z.string().optional(),
  salePrice: z.coerce.number().optional(),
  buyerInfo: z.string().optional(), // Could be a customer ID
  status: z.enum(['In-stock', 'Sold', 'Reserved']),
  expenses: z.coerce.number().optional().default(0),
  profitOrLoss: z.coerce.number().optional().default(0),
});

export type Vehicle = z.infer<typeof vehicleSchema>;
