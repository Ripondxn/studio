'use server';

/**
 * @fileOverview A rental price suggestion AI agent.
 *
 * - suggestRentalPrice - A function that suggests a rental price.
 * - SuggestRentalPriceInput - The input type for the suggestRentalPrice function.
 * - SuggestRentalPriceOutput - The return type for the suggestRentalPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRentalPriceInputSchema = z.object({
  propertyAddress: z
    .string()
    .describe('The address of the property to rent.'),
  propertyType: z
    .string()
    .describe(
      'The type of property, such as apartment, house, or commercial space.'
    ),
  bedrooms: z.number().describe('The number of bedrooms in the property.'),
  bathrooms: z.number().describe('The number of bathrooms in the property.'),
  squareFootage: z
    .number()
    .describe('The square footage of the property.'),
  locationFeatures: z
    .string()
    .describe(
      'Notable features of the location, such as proximity to schools, parks, or public transportation.'
    ),
  propertyFeatures: z
    .string()
    .describe(
      'Features of the property, such as hardwood floors, updated kitchen, or balcony.'
    ),
  marketRentals: z.string().describe('Example of market rentals in the area'),
});
export type SuggestRentalPriceInput = z.infer<typeof SuggestRentalPriceInputSchema>;

const SuggestRentalPriceOutputSchema = z.object({
  suggestedRentalPrice: z
    .number()
    .describe(
      'The suggested monthly rental price for the property, based on market data.'
    ),
  priceJustification: z
    .string()
    .describe(
      'A detailed justification for the suggested rental price, including comparable properties and market trends.'
    ),
});
export type SuggestRentalPriceOutput = z.infer<typeof SuggestRentalPriceOutputSchema>;

export async function suggestRentalPrice(input: SuggestRentalPriceInput): Promise<SuggestRentalPriceOutput> {
  return suggestRentalPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRentalPricePrompt',
  input: {schema: SuggestRentalPriceInputSchema},
  output: {schema: SuggestRentalPriceOutputSchema},
  prompt: `You are an expert real estate analyst specializing in rental pricing.

  Based on the following property details and market data, suggest an optimal monthly rental price for the property.

  Property Address: {{{propertyAddress}}}
  Property Type: {{{propertyType}}}
  Bedrooms: {{{bedrooms}}}
  Bathrooms: {{{bathrooms}}}
  Square Footage: {{{squareFootage}}}
  Location Features: {{{locationFeatures}}}
  Property Features: {{{propertyFeatures}}}
  Market Rentals: {{{marketRentals}}}

  Consider comparable properties and current market trends to provide a data-driven rental price suggestion.
  Also give a detailed justification for the suggested price.
  `,
});

const suggestRentalPriceFlow = ai.defineFlow(
  {
    name: 'suggestRentalPriceFlow',
    inputSchema: SuggestRentalPriceInputSchema,
    outputSchema: SuggestRentalPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
