

import { z } from 'zod';

export const attachmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  file: z.string().nullable(),
  remarks: z.string(),
  isLink: z.boolean()
});

export const tenantSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Code is required."),
  name: z.string().min(1, "Name is required."),
  mobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  contractNo: z.string().optional(),
  contractId: z.string().nullable().optional(),
  attachments: z.array(attachmentSchema).optional(),
  eid: z.string().optional(),
  occupation: z.string().optional(),
  brokerName: z.string().optional(),
  brokerMobile: z.string().optional(),
  brokerEmail: z.string().email().optional().or(z.literal('')),
  brokerCommission: z.number().optional(),
  property: z.string().optional(),
  unitCode: z.string().optional(),
  roomCode: z.string().optional(),
  isSubscriptionActive: z.boolean().optional(),
  subscriptionStatus: z.enum(['Yearly', 'Monthly']).optional(),
  subscriptionAmount: z.number().optional(),
  dueBalance: z.number().optional(),
  occupancyStatus: z.enum(['Vacant', 'Occupied', 'Partially Occupied']).optional(),
  contractValue: z.number().optional(),
  paidAmount: z.number().optional(),
});

export type Tenant = z.infer<typeof tenantSchema>;
