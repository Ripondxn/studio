
import { z } from 'zod';

export const rentalSchema = z.object({
  id: z.string(),
  contractNo: z.string().min(1, "Contract number is required."),
  contractDate: z.string().min(1, "Contract date is required."),
  rentalType: z.enum(['Hired', 'Rented']), // Hired (from others), Rented (to others)
  partyType: z.enum(['Vendor', 'Customer']),
  partyCode: z.string().min(1, "Party is required."),
  partyName: z.string(),
  carDetails: z.string().min(1, "Car details are required."),
  plateNumber: z.string().optional(),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  rentalAmount: z.number().min(0, "Rental amount must be a positive number."),
  status: z.enum(['Active', 'Completed', 'Cancelled']),
  notes: z.string().optional(),
});

export type Rental = z.infer<typeof rentalSchema>;
