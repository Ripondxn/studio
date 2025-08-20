
import { z } from 'zod';

export const paymentInstallmentSchema = z.object({
  installment: z.number(),
  dueDate: z.string(),
  amount: z.number(),
  status: z.enum(['paid', 'unpaid']),
});

export const contractSchema = z.object({
  id: z.string(),
  contractNo: z.string().min(1, "Contract number is required."),
  contractDate: z.string().min(1, "Contract date is required."),
  unitCode: z.string().min(1, "Unit code is required."),
  tenantName: z.string().min(1, "Tenant name is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  totalRent: z.number().min(0, "Total rent must be a positive number."),
  paymentMode: z.enum(['cash', 'cheque', 'bank-transfer']),
  paymentSchedule: z.array(paymentInstallmentSchema),
  terms: z.string().optional(),
});

export type PaymentInstallment = z.infer<typeof paymentInstallmentSchema>;
export type Contract = z.infer<typeof contractSchema>;
