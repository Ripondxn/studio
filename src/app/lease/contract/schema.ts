
import { z } from 'zod';

export const paymentInstallmentSchema = z.object({
  installment: z.number(),
  dueDate: z.string(),
  amount: z.number(),
  status: z.enum(['paid', 'unpaid']),
});

export const leaseContractSchema = z.object({
  id: z.string(),
  contractNo: z.string().min(1, "Contract number is required."),
  contractDate: z.string().min(1, "Contract date is required."),
  property: z.string().min(1, "Property is required."),
  landlordCode: z.string().min(1, "Landlord is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  totalRent: z.number().min(0, "Total rent must be a positive number."),
  paymentMode: z.enum(['cash', 'cheque', 'bank-transfer']),
  status: z.enum(['New', 'Renew', 'Cancel']).optional(),
  terminationDate: z.string().optional(),
  paymentFrequency: z.enum(['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'Custom']).optional(),
  numberOfPayments: z.number().optional(),
  paymentSchedule: z.array(paymentInstallmentSchema),
  terms: z.string().optional(),
});

export type PaymentInstallment = z.infer<typeof paymentInstallmentSchema>;
export type LeaseContract = z.infer<typeof leaseContractSchema>;
