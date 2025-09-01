
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List } from 'lucide-react';
import { EmployeeGrid } from './employee-grid';
import { EmployeeList } from './employee-list';
import { type Employee } from './schema';

export function EmployeeContent({ employees }: { employees: Employee[] }) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = React.useState('');

  const filteredEmployees = React.useMemo(() => {
    if (!filter) {
      return employees;
    }
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(filter.toLowerCase()) ||
      (employee.profession && employee.profession.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [employees, filter]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Filter by name or profession..."
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
        <EmployeeList employees={filteredEmployees} />
      ) : (
        <EmployeeGrid employees={filteredEmployees} />
      )}
    </>
  );
}
