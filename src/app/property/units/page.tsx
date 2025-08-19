
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

import { columns } from './columns';
import { DataTable } from './data-table';
import { unitSchema } from './schema';

// Simulate a database call to get units data
async function getUnits() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/property/units/units-data.json')
  );
  const units = JSON.parse(data.toString());
  return z.array(unitSchema).parse(units);
}

export default async function UnitsPage() {
  const units = await getUnits();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 font-headline">Units</h1>
      <DataTable columns={columns} data={units} />
    </div>
  );
}
