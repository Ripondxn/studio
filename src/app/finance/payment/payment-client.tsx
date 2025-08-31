
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPayments, getSummary } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Plus, Receipt } from 'lucide-react';
import { type Payment } from './schema';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useCurrency } from '@/context/currency-context';

type Summary = {
    totalReceivedThisMonth: number;
    totalPaidThisMonth: number;
}

export function PaymentsClient() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalReceivedThisMonth: 0, totalPaidThisMonth: 0});
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ email: string, name: string, role: UserRole['role'] } | null>(null);
  const { formatCurrency } = useCurrency();

  const searchParams = useSearchParams();
  const accountIdFilter = searchParams.get('accountId');
  const router = useRouter();
  const { toast } = useToast();
  
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    try {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            setCurrentUser(profile);
        } else {
            router.push('/login');
        }
    } catch(e) {
        router.push('/login');
    }
  }, [router]);

  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
        const [paymentsResult, summaryResult] = await Promise.all([
            getPayments(currentUser),
            getSummary()
        ]);
        setPayments(paymentsResult);
        setSummary(summaryResult);
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load payment data.'});
    } finally {
        setIsLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    if (currentUser) {
        refreshData();
    }
  }, [currentUser, refreshData]);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshData]);

  const filteredPayments = useMemo(() => {
    if (!accountIdFilter) {
      return payments.filter(p => p.status !== 'Cancelled');
    }
    return payments.filter(p => {
        if (p.status === 'Cancelled') return false;
        if (p.paymentFrom === 'Petty Cash' && accountIdFilter === 'acc_3') {
            return true;
        }
        return p.bankAccountId === accountIdFilter
    });
  }, [payments, accountIdFilter]);

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsPaymentDialogOpen(true);
  }

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentDialogOpen(true);
  }
  
  const handlePaymentAdded = () => {
    refreshData();
  }

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
            <Button onClick={handleAddPayment}>
                <Receipt className="mr-2 h-4 w-4" /> Record New Payment
            </Button>
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
            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalReceivedThisMonth)}</div>
            <p className="text-xs text-muted-foreground">from tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid (This Month)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalPaidThisMonth)}</div>
            <p className="text-xs text-muted-foreground">to landlords & vendors</p>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns({onEdit: handleEditPayment})} data={filteredPayments} />
      )}
      
       <AddPaymentDialog
        isOpen={isPaymentDialogOpen}
        setIsOpen={setIsPaymentDialogOpen}
        defaultValues={selectedPayment || undefined}
        onPaymentAdded={handlePaymentAdded}
      />
    </div>
  );
}
