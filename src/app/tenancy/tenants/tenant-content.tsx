
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List } from 'lucide-react';
import { TenantGrid } from './tenant-grid';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Tenant } from './schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function TenantContent({ tenants }: { tenants: Tenant[] }) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = React.useState('');
  const [tenancyTypeFilter, setTenancyTypeFilter] = React.useState('all');

  const filteredTenants = React.useMemo(() => {
    let filtered = tenants;
    
    if (filter) {
        filtered = filtered.filter(tenant =>
            tenant.name.toLowerCase().includes(filter.toLowerCase())
        );
    }
    
    if (tenancyTypeFilter !== 'all') {
        const isSubscription = tenancyTypeFilter === 'subscription';
        filtered = filtered.filter(tenant => !!tenant.isSubscriptionActive === isSubscription);
    }

    // Sort by tenant code in ascending order for both grid and list views
    return filtered.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));

  }, [tenants, filter, tenancyTypeFilter]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
            <Input
              placeholder="Filter by name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
             <Select value={tenancyTypeFilter} onValueChange={setTenancyTypeFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="subscription">Subscription Based</SelectItem>
                    <SelectItem value="contract">Contract Based</SelectItem>
                </SelectContent>
            </Select>
        </div>
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
