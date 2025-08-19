
import { type UserRole as AppUserRole } from '@/app/admin/user-roles/schema';

// This combines the string literals from the UserRole type for use here
export type Role = AppUserRole['role'];

export type Status =
  | 'DRAFT'
  | 'PENDING_ADMIN_APPROVAL'
  | 'PENDING_SUPER_ADMIN_APPROVAL'
  | 'POSTED'
  | 'REJECTED';

export type ApprovalHistory = {
  action: string;
  actorId: string;
  actorRole: Role;
  timestamp: string;
  comments?: string;
};

export type Transaction = {
  id: string;
  type: string;
  amount: number;
  createdByUser: {
    id: string;
    name: string;
  };
  dateCreated: string;
  submittedForApprovalDate: string;
  currentStatus: Status;
  approvalHistory: ApprovalHistory[];
};
