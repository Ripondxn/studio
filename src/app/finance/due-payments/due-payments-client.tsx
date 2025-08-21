
'use client';

import { useState, useEffect } from 'react';
import { getDuePayments, getSummary } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { type DuePayment } from './schema';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Summary = {
    totalReceivable: number;
    totalPayable: number;
    overdueReceivable: number;
    overduePayable: number;
}

export function DuePaymentsClient({ initialPayments, initialSummary }: { initialPayments: DuePayment[], initialSummary: Summary }) {
  const [payments, setPayments] = useState(initialPayments);
  const [summary, setSummary] = useState(initialSummary);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    const paymentsResult = await getDuePayments();
    const summaryResult = await getSummary(paymentsResult);
    setPayments(paymentsResult);
    setSummary(summaryResult);
    setIsLoading(false);
  }

  useEffect(() => {
    setPayments(initialPayments);
    setSummary(initialSummary);
  }, [initialPayments, initialSummary]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Due Payments Report</h1>
            <p className="text-muted-foreground">
                A consolidated view of all upcoming and overdue payments.
            </p>
        </div>
         <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receivable</CardTitle>
            <ArrowDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.totalReceivable)}</div>
            <p className="text-xs text-muted-foreground">All upcoming payments from tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payable</CardTitle>
            <ArrowUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.totalPayable)}</div>
            <p className="text-xs text-muted-foreground">All upcoming payments to landlords</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Receivable</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.overdueReceivable)}</div>
            <p className="text-xs text-muted-foreground">Receivables past their due date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payable</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.overduePayable)}</div>
            <p className="text-xs text-muted-foreground">Payables past their due date</p>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={payments} />
    </div>
  );
}
