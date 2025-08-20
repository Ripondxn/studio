
import Link from 'next/link';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllContracts } from '../contract/actions';

export default async function ContractsPage() {
  const contracts = await getAllContracts();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Tenancy Contracts</h1>
        <Button asChild>
          <Link href="/tenancy/contract">
            <Plus className="mr-2 h-4 w-4" /> Add New Contract
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={contracts} />
    </div>
  );
}
