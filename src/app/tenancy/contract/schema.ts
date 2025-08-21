

import { z } from 'zod';

export const paymentInstallmentSchema = z.object({
  installment: z.number(),
  dueDate: z.string(),
  amount: z.number(),
  status: z.enum(['paid', 'unpaid']),
  chequeNo: z.string().optional(),
  bankName: z.string().optional(),
});

export const contractSchema = z.object({
  id: z.string(),
  contractNo: z.string().min(1, "Contract number is required."),
  contractDate: z.string().min(1, "Contract date is required."),
  property: z.string().optional(),
  unitCode: z.string().min(1, "Unit code is required."),
  roomCode: z.string().optional(),
  partitionCode: z.string().optional(),
  tenantCode: z.string().optional(),
  tenantName: z.string().min(1, "Tenant name is required."),
  mobile: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  totalRent: z.number().min(0, "Total rent must be a positive number."),
  paymentMode: z.enum(['cash', 'cheque', 'bank-transfer']),
  status: z.enum(['New', 'Renew', 'Cancel']).optional(),
  terminationDate: z.string().optional(),
  rentBasedOn: z.enum(['Monthly', 'Daily']).optional(),
  paymentFrequency: z.enum(['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'Custom']).optional(),
  numberOfPayments: z.number().optional(),
  gracePeriod: z.number().optional(),
  paymentSchedule: z.array(paymentInstallmentSchema),
  terms: z.string().optional(),
  tawtheeqRegistrationNo: z.string().optional(),
  tawtheeqStatus: z.enum(['Not Registered', 'Under Process', 'Registered']).optional(),
  tawtheeqRegistrationDate: z.string().optional(),
});

export type PaymentInstallment = z.infer<typeof paymentInstallmentSchema>;
export type Contract = z.infer<typeof contractSchema>;
