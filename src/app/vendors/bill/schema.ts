
import { z } from 'zod';

export const billItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required.'),
  quantity: z.number().min(1, 'Quantity must be at least 1.'),
  unitPrice: z.number().min(0, 'Unit price must be positive.'),
  total: z.number(),
  expenseAccountId: z.string().optional(),
});

export const billSchema = z.object({
  id: z.string(),
  billNo: z.string().min(1, 'Bill number is required.'),
  vendorCode: z.string().min(1, 'Vendor is required.'),
  vendorName: z.string().min(1, 'Vendor name is required.'),
  property: z.string().optional(),
  unitCode: z.string().optional(),
  roomCode: z.string().optional(),
  maintenanceTicketId: z.string().optional(),
  billDate: z.string().min(1, 'Bill date is required.'),
  dueDate: z.string().min(1, 'Due date is required.'),
  items: z.array(billItemSchema).min(1, 'At least one item is required.'),
  subTotal: z.number(),
  taxType: z.enum(['exclusive', 'inclusive']).default('exclusive'),
  taxRate: z.number().optional().default(0),
  tax: z.number(),
  total: z.number(),
  amountPaid: z.number().optional().default(0),
  remainingBalance: z.number().optional(),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled']),
  notes: z.string().optional(),
});

export type Bill = z.infer<typeof billSchema>;
export type BillItem = z.infer<typeof billItemSchema>;
