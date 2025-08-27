
import { z } from 'zod';

export const paymentInstallmentSchema = z.object({
  installment: z.number(),
  dueDate: z.string(),
  amount: z.number(),
  status: z.enum(['paid', 'unpaid']),
});

export const maintenanceContractSchema = z.object({
  id: z.string(),
  contractNo: z.string().min(1, "Contract number is required."),
  contractDate: z.string().min(1, "Contract date is required."),
  propertyCode: z.string().min(1, "Property is required."),
  vendorCode: z.string().min(1, "Vendor is required."),
  serviceType: z.string().min(1, "Service type is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  totalValue: z.number().min(0, "Total value must be a positive number."),
  status: z.enum(['Active', 'Expired', 'Cancelled']),
  paymentFrequency: z.enum(['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'Custom']),
  numberOfPayments: z.number().min(1, "Number of payments must be at least 1."),
  paymentSchedule: z.array(paymentInstallmentSchema),
  terms: z.string().optional(),
});

export type PaymentInstallment = z.infer<typeof paymentInstallmentSchema>;
export type MaintenanceContract = z.infer<typeof maintenanceContractSchema>;
