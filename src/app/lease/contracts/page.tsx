
import Link from 'next/link';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllLeaseContracts } from '../contract/actions';

export default async function LeaseContractsPage() {
  const contracts = await getAllLeaseContracts();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Lease Contracts</h1>
        <Button asChild>
          <Link href="/lease/contract">
            <Plus className="mr-2 h-4 w-4" /> Add New Lease Contract
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={contracts} />
    </div>
  );
}
