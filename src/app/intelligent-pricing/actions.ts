'use server';
import {
  suggestRentalPrice,
  SuggestRentalPriceInput,
} from '@/ai/flows/suggest-rental-price';
import { z } from 'zod';

const formSchema = z.object({
  propertyAddress: z.string().min(1, 'Property address is required.'),
  propertyType: z.string().min(1, 'Property type is required.'),
  bedrooms: z.coerce.number().min(0, 'Bedrooms must be a positive number.'),
  bathrooms: z.coerce.number().min(0, 'Bathrooms must be a positive number.'),
  squareFootage: z.coerce
    .number()
    .min(1, 'Square footage must be greater than 0.'),
  locationFeatures: z.string().min(1, 'Location features are required.'),
  propertyFeatures: z.string().min(1, 'Property features are required.'),
  marketRentals: z.string().min(1, 'Market rentals examples are required.'),
});

export async function getSuggestedPrice(data: SuggestRentalPriceInput) {
  const validation = formSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid input data.',
    };
  }

  try {
    const result = await suggestRentalPrice(validation.data);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: 'Failed to get price suggestion. Please try again.',
    };
  }
}
