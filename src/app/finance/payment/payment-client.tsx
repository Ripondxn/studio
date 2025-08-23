
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPayments, getSummary } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddPaymentDialog } from './add-payment-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Plus, Receipt } from 'lucide-react';
import { type Payment } from './schema';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type Summary = {
    totalReceivedThisMonth: number;
    totalPaidThisMonth: number;
}

export function PaymentsClient({ initialPayments, initialSummary }: { initialPayments: Payment[], initialSummary: Summary }) {
  const [payments, setPayments] = useState(initialPayments);
  const [summary, setSummary] = useState(initialSummary);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const accountIdFilter = searchParams.get('accountId');
  const router = useRouter();

  const refreshData = async () => {
    setIsLoading(true);
    const [paymentsResult, summaryResult] = await Promise.all([
        getPayments(),
        getSummary()
    ]);
    setPayments(paymentsResult);
    setSummary(summaryResult);
    setIsLoading(false);
    router.refresh();
  }

  useEffect(() => {
    setPayments(initialPayments);
    setSummary(initialSummary);
  }, [initialPayments, initialSummary]);

  const filteredPayments = useMemo(() => {
    if (!accountIdFilter) {
      return payments;
    }
    return payments.filter(p => {
        if (p.paymentMethod === 'Cash' && p.paymentFrom === 'Petty Cash' && accountIdFilter === 'acc_3') {
            return true;
        }
        return p.bankAccountId === accountIdFilter
    });
  }, [payments, accountIdFilter]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Payments & Receipts</h1>
            <p className="text-muted-foreground">
                Record and manage all incoming and outgoing payments.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <AddPaymentDialog isOpen={isPaymentDialogOpen} setIsOpen={setIsPaymentDialogOpen} onPaymentAdded={refreshData}>
              <Button>
                <Receipt className="mr-2 h-4 w-4" /> Record New Payment
              </Button>
            </AddPaymentDialog>
            <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received (This Month)</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.totalReceivedThisMonth)}</div>
            <p className="text-xs text-muted-foreground">from tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid (This Month)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.totalPaidThisMonth)}</div>
            <p className="text-xs text-muted-foreground">to landlords & vendors</p>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={filteredPayments} />
    </div>
  );
}
