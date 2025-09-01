
export type PermissionAction = {
  action: string;
  description: string;
  allowedRoles: string[];
};

export type FeaturePermission = {
  feature: string;
  description: string;
  actions: PermissionAction[];
};

export const featurePermissions: FeaturePermission[] = [
  {
    feature: 'Properties',
    description: 'Manage property listings, details, and associated units/rooms.',
    actions: [
      { action: 'view', description: 'View property list and details', allowedRoles: ['Super Admin', 'Admin', 'Property Manager', 'Accountant', 'User'] },
      { action: 'edit', description: 'Edit property information', allowedRoles: ['Super Admin', 'Admin', 'Property Manager'] },
      { action: 'delete', description: 'Delete a property', allowedRoles: ['Super Admin'] },
    ],
  },
  {
    feature: 'Units',
    description: 'Manage individual units within a property.',
    actions: [
      { action: 'view', description: 'View unit list and details', allowedRoles: ['Super Admin', 'Admin', 'Property Manager', 'Accountant', 'User'] },
      { action: 'edit', description: 'Edit unit information', allowedRoles: ['Super Admin', 'Admin', 'Property Manager'] },
      { action: 'delete', description: 'Delete a unit', allowedRoles: ['Super Admin'] },
    ],
  },
   {
    feature: 'Rent-A-Car',
    description: 'Manage vehicle rental agreements.',
    actions: [
      { action: 'view', description: 'View rental agreements', allowedRoles: ['Super Admin', 'Admin', 'User'] },
      { action: 'manage', description: 'Add/Edit/Delete rental agreements', allowedRoles: ['Super Admin', 'Admin'] },
    ],
  },
  {
    feature: 'Project Management',
    description: 'Manage all aspects of projects, including billing, sub-contractors, and resource allocation.',
    actions: [
      { action: 'view', description: 'View project list and details', allowedRoles: ['Super Admin', 'Admin', 'Property Manager'] },
      { action: 'manage', description: 'Create, edit, and delete projects', allowedRoles: ['Super Admin', 'Admin'] },
      { action: 'manage_billing', description: 'Manage project progress billing and retention', allowedRoles: ['Super Admin', 'Accountant'] },
    ],
  },
  {
    feature: 'Landlords',
    description: 'Manage landlord profiles and their associated contracts.',
    actions: [
      { action: 'view', description: 'View landlord list and details', allowedRoles: ['Super Admin', 'Admin', 'Property Manager', 'Accountant'] },
      { action: 'edit', description: 'Edit landlord information', allowedRoles: ['Super Admin', 'Admin', 'Property Manager'] },
      { action: 'delete', description: 'Delete a landlord', allowedRoles: ['Super Admin'] },
    ],
  },
  {
    feature: 'Tenants',
    description: 'Manage tenant profiles and their tenancy contracts.',
    actions: [
      { action: 'view', description: 'View tenant list and details', allowedRoles: ['Super Admin', 'Admin', 'Property Manager', 'Accountant', 'User'] },
      { action: 'edit', description: 'Edit tenant information', allowedRoles: ['Super Admin', 'Admin', 'Property Manager'] },
      { action: 'delete', description: 'Delete a tenant', allowedRoles: ['Super Admin'] },
    ],
  },
  {
    feature: 'Finance',
    description: 'Access to financial modules like banking, payments, and chart of accounts.',
    actions: [
      { action: 'view_banking', description: 'View Banking and Petty Cash', allowedRoles: ['Super Admin', 'Admin', 'Accountant'] },
      { action: 'manage_banking', description: 'Add/Edit/Delete bank accounts', allowedRoles: ['Super Admin', 'Admin'] },
      { action: 'view_payments', description: 'View payment and receipt history', allowedRoles: ['Super Admin', 'Admin', 'Accountant'] },
      { action: 'record_payment', description: 'Record new payments or receipts', allowedRoles: ['Super Admin', 'Admin', 'Accountant'] },
      { action: 'delete_payment', description: 'Delete financial transactions', allowedRoles: ['Super Admin'] },
    ],
  },
  {
    feature: 'User Management',
    description: 'Control over user accounts and their roles.',
    actions: [
      { action: 'view', description: 'View user list', allowedRoles: ['Super Admin', 'Admin'] },
      { action: 'add_user', description: 'Add new users', allowedRoles: ['Super Admin', 'Admin'] },
      { action: 'edit_user', description: 'Edit user details and roles', allowedRoles: ['Super Admin', 'Admin'] },
      { action: 'delete_user', description: 'Delete a user', allowedRoles: ['Super Admin'] },
    ],
  },
  {
    feature: 'Settings',
    description: 'Access to administrative settings.',
    actions: [
        { action: 'access_control', description: 'Manage user roles and permissions', allowedRoles: ['Super Admin'] },
        { action: 'communication', description: 'Manage communication (Email/SMS) settings', allowedRoles: ['Super Admin', 'Admin'] },
        { action: 'backup', description: 'Manage data backup and restore', allowedRoles: ['Super Admin'] },
        { action: 'external_storage', description: 'Configure external storage (e.g., Google Drive)', allowedRoles: ['Developer'] },
        { action: 'notifications', description: 'Send system-wide notifications', allowedRoles: ['Super Admin', 'Admin'] },
        { action: 'contract_continuity', description: 'Review and fix contract data issues', allowedRoles: ['Super Admin'] },
    ]
  }
];
