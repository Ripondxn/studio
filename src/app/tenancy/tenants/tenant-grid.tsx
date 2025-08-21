
'use client';

import { TenantCard } from './tenant-card';
import { type Tenant } from './schema';

interface TenantGridProps {
  tenants: Tenant[];
}

export function TenantGrid({ tenants }: TenantGridProps) {
  if (tenants.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No tenants found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {tenants.map(tenant => (
        <TenantCard key={tenant.code} tenant={tenant} />
      ))}
    </div>
  );
}
