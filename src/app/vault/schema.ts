
import { z } from 'zod';

export const securityQuestionSchema = z.object({
  question: z.string().nonempty({ message: "Question cannot be empty" }),
  answer: z.string().nonempty({ message: "Answer cannot be empty" }),
});

export const accountCredentialSchema = z.object({
  id: z.string().optional(),
  userId: z.string().nonempty(), 
  accountType: z.enum([
    'email', 'bank', 'utility_water', 'utility_electricity', 
    'subscription_elife', 'subscription_other', 'telephone', 'third_party', 'other'
  ]),
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(), // Will be stored encrypted
  accountNumber: z.string().optional(), // Will be stored encrypted
  associatedVendorId: z.string().optional(),
  associatedCustomerId: z.string().optional(),
  linkedFinanceAccountId: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  securityQuestions: z.array(securityQuestionSchema).optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  isDeleted: z.boolean().default(false).optional(),
});

export type AccountCredential = z.infer<typeof accountCredentialSchema>;
export type SecurityQuestion = z.infer<typeof securityQuestionSchema>;
