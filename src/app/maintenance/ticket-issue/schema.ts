

import { z } from 'zod';

export const maintenanceTicketSchema = z.object({
  id: z.string(),
  ticketNo: z.string().min(1, "Ticket number is required."),
  requestDate: z.string().min(1, "Request date is required."),
  propertyCode: z.string().min(1, "Property is required."),
  unitCode: z.string().min(1, "Unit is required."),
  roomCode: z.string().optional(),
  tenantName: z.string().min(1, "Tenant name is required."),
  issueType: z.string().min(1, "Issue type is required."),
  description: z.string().min(1, "Description is required."),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  status: z.enum(['Open', 'In Progress', 'On Hold', 'Completed', 'Cancelled']),
  assignedTo: z.string().optional(),
  resolutionDetails: z.string().optional(),
  completedDate: z.string().optional(),
});

export type MaintenanceTicket = z.infer<typeof maintenanceTicketSchema>;
