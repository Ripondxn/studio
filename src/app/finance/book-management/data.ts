
import { z } from "zod";

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["asset", "liability", "equity", "revenue", "expense"]),
});

export const journalEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  description: z.string(),
  debitAccountId: z.string(),
  creditAccountId: z.string(),
  amount: z.number(),
  status: z.enum(["DRAFT", "PENDING_ADMIN_APPROVAL", "PENDING_SUPER_ADMIN_APPROVAL", "POSTED"]),
});

export type Account = z.infer<typeof accountSchema>;
export type JournalEntry = z.infer<typeof journalEntrySchema>;
