
import { z } from 'zod';

export const agentSchema = z.object({
  code: z.string(),
  name: z.string(),
  mobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  commission: z.number().optional(),
  vendorName: z.string(),
  vendorCode: z.string(),
  isCommissionPaid: z.boolean().optional(),
});

export type Agent = z.infer<typeof agentSchema>;
