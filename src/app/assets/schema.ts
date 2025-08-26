
import { z } from 'zod';

export const assetHistorySchema = z.object({
  date: z.string(),
  status: z.string(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

export const assetSchema = z.object({
  id: z.string(),
  assetCode: z.string().min(1, 'Asset code is required.'),
  assetName: z.string().min(1, 'Asset name is required.'),
  assetType: z.enum(['Tangible', 'Intangible']),
  purchaseDate: z.string().min(1, 'Purchase date is required.'),
  purchaseCost: z.number().min(0, 'Purchase cost must be a positive number.'),
  depreciationMethod: z.enum(['Straight-Line', 'Declining Balance']),
  usefulLife: z.number().min(0, 'Useful life (in years) must be a positive number.'),
  salvageValue: z.number().min(0, 'Salvage value must be a positive number.'),
  currentValue: z.number().optional(),
  status: z.enum(['In Stock', 'Assigned', 'Damaged', 'Out for Repair', 'Retired']).default('In Stock'),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
  history: z.array(assetHistorySchema).optional(),
});

export type Asset = z.infer<typeof assetSchema>;
export type AssetHistory = z.infer<typeof assetHistorySchema>;
