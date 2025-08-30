
'use server';

/**
 * @fileOverview An AI flow for processing and extracting data from documents.
 *
 * - processDocument - A function that extracts structured data from a document image or PDF.
 * - ProcessDocumentInput - The input type for the processDocument function.
 * - ProcessedDocument - The return type for the processDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProcessDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document (invoice, receipt, etc.) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ProcessDocumentInput = z.infer<typeof ProcessDocumentInputSchema>;

const LineItemSchema = z.object({
    description: z.string().describe('The description of the line item.'),
    quantity: z.number().describe('The quantity of the item.'),
    unitPrice: z.number().describe('The price per unit of the item.'),
    total: z.number().describe('The total price for the line item (quantity * unitPrice).'),
});

const ProcessedDocumentSchema = z.object({
  documentType: z.enum(['Invoice', 'Receipt', 'Bill', 'Other']).describe('The type of document, e.g., Invoice, Receipt, Bill.'),
  vendorName: z.string().optional().describe("The name of the vendor or company that issued the document."),
  customerName: z.string().optional().describe("The name of the customer or person the document was issued to."),
  date: z.string().optional().describe("The main date on the document (invoice date, receipt date, etc.) in YYYY-MM-DD format."),
  dueDate: z.string().optional().describe("The due date for payment, if applicable, in YYYY-MM-DD format."),
  vatRegNo: z.string().optional().describe("The VAT or Tax Registration Number (TRN) of the issuer, if present."),
  items: z.array(LineItemSchema).describe('An array of all line items from the document.'),
  subTotal: z.number().optional().describe('The subtotal amount before taxes.'),
  tax: z.number().optional().describe('The total tax amount.'),
  total: z.number().describe('The final, total amount.'),
});
export type ProcessedDocument = z.infer<typeof ProcessedDocumentSchema>;


const documentProcessorPrompt = ai.definePrompt({
  name: 'documentProcessorPrompt',
  input: { schema: ProcessDocumentInputSchema },
  output: { schema: ProcessedDocumentSchema },
  prompt: `You are an expert data entry assistant for a property management system. Your task is to extract structured information from the provided document. The document could be an invoice, a bill from a vendor, or a payment receipt.

Analyze the document provided and extract the following information. Be as accurate as possible. If a field is not present, omit it.

- Document Type: Determine if this is an Invoice, a receipt for payment, or a bill from a supplier.
- Vendor/Customer Names: Identify who the document is from and who it is for.
- Dates: Find the issue date and due date. Format them as YYYY-MM-DD.
- Financials: Extract all line items with their quantity and price. Also, find the subtotal, tax amount, and the final total.
- Registration Numbers: Look for a VAT or Tax Registration Number.

Document to process:
{{media url=documentDataUri}}
`,
});

const processDocumentFlow = ai.defineFlow(
  {
    name: 'processDocumentFlow',
    inputSchema: ProcessDocumentInputSchema,
    outputSchema: ProcessedDocumentSchema,
  },
  async (input) => {
    const { output } = await documentProcessorPrompt(input);
    if (!output) {
      throw new Error('Failed to process document. The model did not return any output.');
    }
    return output;
  }
);

export async function processDocument(input: ProcessDocumentInput): Promise<ProcessedDocument> {
  return await processDocumentFlow(input);
}
