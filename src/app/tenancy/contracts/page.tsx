

import Link from 'next/link';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllContracts } from '../contract/actions';
import { promises as fs } from 'fs';
import path from 'path';

async function getProperties() {
    try {
        const data = await fs.readFile(
            path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json')
        );
        return JSON.parse(data.toString());
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export default async function ContractsPage() {
  const contracts = await getAllContracts();
  const properties = await getProperties();
  const propertyLookups = properties.map((p: any) => ({ value: (p.propertyData || p).code, label: (p.propertyData || p).name }));

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
      <DataTable columns={columns} data={contracts} properties={propertyLookups} />
    </div>
  );
}
