
'use client';

import * as React from 'react';
import Link from 'next/link';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { getAllLandlords } from './actions';
import { LandlordGrid } from './landlord-grid';
import { DataTable } from './data-table';
import { Landlord } from './schema';

async function LandlordsPage() {
  const landlords: Landlord[] = await getAllLandlords();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Landlords</h1>
        <Button asChild>
            <Link href="/landlord/add">
                <Plus className="mr-2 h-4 w-4" /> Add New Landlord
            </Link>
        </Button>
      </div>
      <LandlordContent landlords={landlords} />
    </div>
  );
}


function LandlordContent({ landlords }: { landlords: Landlord[] }) {
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list');

  return (
    <>
      <div className="flex justify-end items-center mb-4">
          <div className="flex items-center rounded-md bg-muted p-1">
              <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                  <List className="h-5 w-5" />
              </Button>
              <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                  <LayoutGrid className="h-5 w-5" />
              </Button>
          </div>
      </div>
      {viewMode === 'list' ? (
         <DataTable columns={columns} data={landlords} />
      ) : (
        <LandlordGrid landlords={landlords} />
      )}
    </>
  );
}

export default LandlordsPage;
