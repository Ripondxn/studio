
import { z } from 'zod';
import type { Role, Status } from './types';

export const approvalHistorySchema = z.object({
  action: z.string(),
  actorId: z.string(),
  actorRole: z.string(), 
  timestamp: z.string(),
  comments: z.string().optional(),
});

export const documentForApprovalSchema = z.object({
  id: z.string(),
  docType: z.string().min(1, "Document type is required."),
  referenceNo: z.string().min(1, "Reference number is required."),
  date: z.string(),
  description: z.string().optional(),
  submittedBy: z.string(),
  currentStatus: z.enum(['DRAFT', 'PENDING_ADMIN_APPROVAL', 'PENDING_SUPER_ADMIN_APPROVAL', 'POSTED', 'REJECTED']),
  approvalHistory: z.array(approvalHistorySchema),
});

export type DocumentForApproval = z.infer<typeof documentForApprovalSchema>;
export type ApprovalHistory = z.infer<typeof approvalHistorySchema>;
