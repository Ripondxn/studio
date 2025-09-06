
import { z } from 'zod';

export const journalEntrySchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  accountId: z.string(),
  accountName: z.string(),
  description: z.string(),
  debit: z.number(),
  credit: z.number(),
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;
