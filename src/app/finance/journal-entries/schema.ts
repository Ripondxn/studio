
import { z } from 'zod';

export const journalEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  debitAccount: z.string(),
  creditAccount: z.string(),
  amount: z.coerce.number(),
  description: z.string(),
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;
