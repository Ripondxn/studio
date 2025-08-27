

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, History } from 'lucide-react';
import { getAllTenants } from './actions';
import { TenantContent } from './tenant-content';
import { Tenant } from './schema';

export default async function TenantsPage() {
  const tenants: Tenant[] = await getAllTenants();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Tenants</h1>
            <p className="text-muted-foreground">Manage tenant profiles, properties, and contracts.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button asChild variant="outline">
                <Link href="/tenancy/movement-history">
                    <History className="mr-2 h-4 w-4" /> Movement History
                </Link>
            </Button>
            <Button asChild>
            <Link href="/tenancy/tenants/add">
                <Plus className="mr-2 h-4 w-4" /> Add New Tenant
            </Link>
            </Button>
        </div>
      </div>
      <TenantContent tenants={tenants} />
    </div>
  );
}
