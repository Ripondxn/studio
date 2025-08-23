

import { type UserRole as AppUserRole } from '@/app/admin/user-roles/schema';

// This combines the string literals from the UserRole type for use here
export type Role = AppUserRole['role'];

export type Status =
  | 'DRAFT'
  | 'PENDING_ADMIN_APPROVAL'
  | 'PENDING_SUPER_ADMIN_APPROVAL'
  | 'POSTED'
  | 'REJECTED';
