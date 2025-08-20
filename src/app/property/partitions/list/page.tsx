
import { getPartitions } from '../actions';
import { columns } from '../columns';
import { DataTable } from '../data-table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function PartitionsListPage() {
  const partitions = await getPartitions();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Partitions</h1>
            <p className="text-muted-foreground">
                A list of all partitions across all properties.
            </p>
        </div>
      </div>
      <DataTable columns={columns} data={partitions} />
    </div>
  );
}
