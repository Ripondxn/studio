
import { z } from 'zod';

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
});

export type Asset = z.infer<typeof assetSchema>;
