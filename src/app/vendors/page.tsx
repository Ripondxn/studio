
import Link from 'next/link';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllVendors } from './actions';

export default async function VendorsPage() {
  const vendors = await getAllVendors();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Vendors</h1>
        <Button asChild>
          <Link href="/vendors/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Vendor
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={vendors} />
    </div>
  );
}
