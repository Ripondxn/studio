
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllMaintenanceContracts } from './actions';
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function MaintenanceContractsPage() {
  const contracts = await getAllMaintenanceContracts();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Maintenance Contracts</h1>
            <p className="text-muted-foreground">Manage recurring service contracts with vendors.</p>
        </div>
        <Button asChild>
          <Link href="/maintenance/contracts/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Contract
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={contracts} />
    </div>
  );
}
