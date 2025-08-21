
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { TenantGrid } from './tenant-grid';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Tenant } from './schema';

export function TenantContent({ tenants }: { tenants: Tenant[] }) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  return (
    <>
      <div className="flex justify-end items-center mb-4">
        <div className="flex items-center rounded-md bg-muted p-1">
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {viewMode === 'list' ? (
        <DataTable columns={columns} data={tenants} />
      ) : (
        <TenantGrid tenants={tenants} />
      )}
    </>
  );
}
