
'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EmployeeContent } from './employee-content';
import { getAllEmployees } from './actions';
import { type Employee } from './schema';
import { useState, useEffect } from 'react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    getAllEmployees().then(data => setEmployees(data));
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Employees</h1>
          <p className="text-muted-foreground">
            Manage all employee profiles and their information.
          </p>
        </div>
        <Button asChild>
          <Link href="/human-resource/employees/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Employee
          </Link>
        </Button>
      </div>
      <EmployeeContent employees={employees} />
    </div>
  );
}
