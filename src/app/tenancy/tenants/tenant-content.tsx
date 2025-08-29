
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List } from 'lucide-react';
import { TenantGrid } from './tenant-grid';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Tenant } from './schema';

export function TenantContent({ tenants }: { tenants: Tenant[] }) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = React.useState('');

  const filteredTenants = React.useMemo(() => {
    const filtered = tenants.filter(tenant =>
      tenant.name.toLowerCase().includes(filter.toLowerCase())
    );

    // Sort by tenant code in ascending order for both grid and list views
    return filtered.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));

  }, [tenants, filter]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Filter by name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
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
        <DataTable columns={columns} data={filteredTenants} />
      ) : (
        <TenantGrid tenants={filteredTenants} />
      )}
    </>
  );
}
