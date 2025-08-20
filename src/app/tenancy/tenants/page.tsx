
import Link from 'next/link';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllTenants } from './actions';

export default async function TenantsPage() {
  const tenants = await getAllTenants();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Tenants</h1>
        <Button asChild>
          <Link href="/tenancy/tenants/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Tenant
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={tenants} />
    </div>
  );
}
