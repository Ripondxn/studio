
'use server';

import { processDocument, type ProcessDocumentInput } from '@/ai/flows/process-document-flow';

export async function extractDataFromDocument(input: ProcessDocumentInput) {
  try {
    const result = await processDocument(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error processing document:', error);
    return { success: false, error: 'Failed to process document with AI.' };
  }
}
