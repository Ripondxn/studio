
'use client';

import { useState, useEffect, useTransition } from 'react';
import { MoreHorizontal, Edit, Trash2, History, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getAllEmployees, deleteEmployeeData } from '@/app/human-resource/employees/actions';
import type { Employee } from '@/app/human-resource/employees/schema';
import EditEmployeeDialog from './edit-employee-dialog';
import EmployeeHistoryDialog from './employee-history-dialog';

export default function EmployeeList() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchEmployees = async () => {
    const allEmployees = await getAllEmployees();
    setEmployees(allEmployees);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsEditOpen(true);
  };

  const handleDelete = (employeeId: string) => {
    startTransition(async () => {
      try {
        await deleteEmployeeData(employeeId);
        await fetchEmployees(); // Refresh the list
        toast({ title: 'Success', description: 'Employee deleted successfully.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
      }
    });
  };

  const handleViewHistory = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsHistoryOpen(true);
  };

  const handlePrintHistory = (employeeId: string) => {
    // This will be handled inside the EmployeeHistoryDialog
    setSelectedEmployeeId(employeeId);
    setIsHistoryOpen(true);
  };

  return (
    <>
      <EditEmployeeDialog
        isOpen={isEditOpen}
        onOpenChange={(isOpen) => {
          setIsEditOpen(isOpen);
          if (!isOpen) fetchEmployees(); // Refresh data on close
        }}
        employeeId={selectedEmployeeId}
      />
      <EmployeeHistoryDialog
        isOpen={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        employeeId={selectedEmployeeId}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Profession</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.employeeId}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.mobile}</TableCell>
              <TableCell>
                <Badge>{employee.profession}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(employee.id!)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(employee.id!)} disabled={isPending}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewHistory(employee.id!)}>
                      <History className="mr-2 h-4 w-4" />
                      <span>View History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePrintHistory(employee.id!)}>
                      <Printer className="mr-2 h-4 w-4" />
                      <span>Print History</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
