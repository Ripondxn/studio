

import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { type Unit } from '../schema';


async function getUnits(): Promise<Unit[]> {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/property/units/units-data.json')
  );
  const units = JSON.parse(data.toString());
  return units;
}


export default async function UnitsPage() {
  const units = await getUnits();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Units</h1>
      </div>
      <DataTable columns={columns} data={units} />
    </div>
  );
}
