
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List } from 'lucide-react';
import { CustomerGrid } from './customer-grid';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Customer } from './schema';

export function CustomerContent({ customers }: { customers: Customer[] }) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');
  const [filter, setFilter] = React.useState('');

  const filteredCustomers = React.useMemo(() => {
    if (!filter) {
      return customers;
    }
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [customers, filter]);

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
        <DataTable columns={columns} data={filteredCustomers} />
      ) : (
        <CustomerGrid customers={filteredCustomers} />
      )}
    </>
  );
}
