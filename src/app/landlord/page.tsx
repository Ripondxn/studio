
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { getAllLandlords } from './actions';
import { LandlordGrid } from './landlord-grid';
import { Landlord } from './schema';

type ViewMode = 'list' | 'grid';

export default function LandlordsPage() {
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllLandlords().then(data => {
      setLandlords(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
        <div className="container mx-auto py-10 flex justify-center items-center">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Landlords</h1>
        <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md bg-muted p-1">
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                    <List className="h-5 w-5" />
                </Button>
                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                    <LayoutGrid className="h-5 w-5" />
                </Button>
            </div>
            <Button asChild>
                <Link href="/landlord/add">
                    <Plus className="mr-2 h-4 w-4" /> Add New Landlord
                </Link>
            </Button>
        </div>
      </div>
      {viewMode === 'list' ? (
         <DataTable columns={columns} data={landlords} />
      ) : (
        <LandlordGrid landlords={landlords} />
      )}
    </div>
  );
}
