
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import Link from 'next/link';

import { columns } from './columns';
import { DataTable } from './data-table';
import { propertySchema } from './schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const propertiesListSchema = z.array(z.object({
  propertyData: propertySchema,
}).transform(item => item.propertyData));


// Simulate a database call to get properties data
async function getProperties() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json')
  );
  const properties = JSON.parse(data.toString());
  // We need to make sure every item in the array has the propertyData field before transforming
  const safeProperties = properties.filter((p: any) => p && p.propertyData);
  return propertiesListSchema.parse(safeProperties);
}

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Properties</h1>
        <Button asChild>
          <Link href="/property/properties">
            <Plus className="mr-2 h-4 w-4" /> Add New Property
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={properties} />
    </div>
  );
}
