

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import Link from 'next/link';

import { columns } from './columns';
import { DataTable } from './data-table';
import { propertySchema } from './schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const propertiesListSchema = z.array(propertySchema);

async function getLandlords() {
    try {
        const data = await fs.readFile(
            path.join(process.cwd(), 'src/app/landlord/landlords-data.json')
        );
        return JSON.parse(data.toString());
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function getProperties() {
  const propertiesData = await fs.readFile(
    path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json')
  );
  const properties = JSON.parse(propertiesData.toString());
  
  const landlords = await getLandlords();
  const landlordMap = new Map(landlords.map((l: any) => [l.landlordData.code, l.landlordData.name]));

  const normalizedProperties = properties.map((p: any) => {
    const baseProperty = p.propertyData ? p.propertyData : p;
    return {
      ...baseProperty,
      id: p.id || baseProperty.id,
      attachments: p.attachments || [],
      landlord: baseProperty.landlordCode ? landlordMap.get(baseProperty.landlordCode) || 'N/A' : 'N/A',
    };
  });

  return propertiesListSchema.parse(normalizedProperties);
}


export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Properties</h1>
        <Button asChild>
          <Link href="/property/properties/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Property
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={properties} />
    </div>
  );
}
