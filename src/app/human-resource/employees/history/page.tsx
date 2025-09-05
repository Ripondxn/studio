
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GitCommit, User, Calendar, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getEmployeeDataById, getEmployeeHistory } from '../../actions';
import { useToast } from '@/hooks/use-toast';
import { type Employee } from '../../schema';

const EmployeeHistoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [history, setHistory] = useState<any[]>([]); // Replace any with a proper type

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const fetchEmployeeHistory = async () => {
        try {
          const employeeData = await getEmployeeDataById(id);
          setEmployee(employeeData);
          const employeeHistory = await getEmployeeHistory(id);
          setHistory(employeeHistory);
        } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        }
      };
      fetchEmployeeHistory();
    } else {
      router.push('/human-resource/employees');
    }
  }, [searchParams, router, toast]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Employee History</h2>
                {employee && (
                    <p className="text-muted-foreground">
                        Change log for <strong>{employee.name}</strong> (ID: {employee.employeeId})
                    </p>
                )}
            </div>
            <Button onClick={() => router.back()}>Back to Employees</Button>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Log</CardTitle>
          <CardDescription>Review the history of changes made to this employee's record.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {history.map((entry, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                    <GitCommit className="h-6 w-6 text-muted-foreground" />
                    <div className="flex-1 w-px bg-muted-foreground/30 my-2"></div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{entry.action}</p>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{entry.changedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(entry.changedAt).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {Object.entries(entry.changes).map(([field, values]) => (
                            <div key={field} className="flex items-start gap-2 text-sm">
                                <Edit className="h-4 w-4 mt-0.5 text-muted-foreground"/>
                                <div>
                                    <span className="font-medium capitalize">{field.replace(/_/g, ' ')}:</span>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <span className="line-through">{String((values as any).old)}</span>
                                        <span>&rarr;</span>
                                        <span className="text-primary font-semibold">{String((values as any).new)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            ))}
            {history.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No history found for this employee.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeHistoryPage;
