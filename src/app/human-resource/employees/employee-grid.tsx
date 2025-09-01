
'use client';

import { EmployeeCard } from './employee-card';
import { type Employee } from './schema';
import { Users } from 'lucide-react';

interface EmployeeGridProps {
  employees: Employee[];
}

export function EmployeeGrid({ employees }: EmployeeGridProps) {
  if (employees.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Users className="mx-auto h-12 w-12" />
        <p className="mt-4">No employees found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {employees.map(employee => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
}
