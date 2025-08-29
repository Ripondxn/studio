

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, DollarSign } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { SubscriptionInvoiceDialog } from './invoice-dialog';
import { InvoiceDialog as GeneralInvoiceDialog } from '@/app/tenancy/customer/invoice/invoice-dialog';
import { type Invoice } from './schema';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { type Payment } from '@/app/finance/payment/schema';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/currency-context';
import { type Tenant } from '../../schema';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cancelSubscription } from '../actions';
import { useToast } from '@/hooks/use-toast';

interface InvoiceListProps {
    tenant: Tenant;
    invoices: Invoice[];
    isLoading: boolean;
    onRefresh: () => void;
}

export function InvoiceList({ tenant, invoices, isLoading, onRefresh }: InvoiceListProps) {
    const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
    const [isGeneralInvoiceDialogOpen, setIsGeneralInvoiceDialogOpen] = useState(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [paymentDefaultValues, setPaymentDefaultValues] = useState<Partial<Omit<Payment, 'id'>>>();
    const [isCancellingSub, setIsCancellingSub] = useState(false);
    const router = useRouter();
    const { formatCurrency } = useCurrency();
    const { toast } = useToast();
    
    const handleCreateClick = () => {
        setSelectedInvoice(null);
        setIsViewMode(false);
        if (tenant.isSubscriptionActive) {
            setIsInvoiceDialogOpen(true);
        } else {
            setIsGeneralInvoiceDialogOpen(true);
        }
    }
    
    const handleEditClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsViewMode(false);
        setIsInvoiceDialogOpen(true);
    }
    
    const handleViewClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsViewMode(true);
        setIsInvoiceDialogOpen(true);
    }
    
    const handleRecordPayment = (invoice?: Invoice) => {
        const openInvoices = invoice ? [invoice] : invoices.filter(inv => inv.status !== 'Paid' && inv.status !== 'Cancelled');
        
        setPaymentDefaultValues({
            type: 'Receipt',
            partyType: 'Tenant',
            partyName: tenant.code,
            date: format(new Date(), 'yyyy-MM-dd'),
            status: 'Received',
            amount: invoice ? (invoice.remainingBalance || 0) : 0,
            invoiceAllocations: openInvoices.map(i => ({
                invoiceId: i.id,
                amount: i.id === invoice?.id ? (i.remainingBalance || 0) : 0,
            }))
        });
        setIsPaymentDialogOpen(true);
    }

    const handleSuccess = () => {
        onRefresh();
    }
    
    const financialSummary = useMemo(() => {
        return invoices.reduce((acc, inv) => {
            if (inv.status !== 'Cancelled') {
                acc.totalBilled += inv.total;
                acc.totalPaid += inv.amountPaid || 0;
            }
            return acc;
        }, { totalBilled: 0, totalPaid: 0 });
    }, [invoices]);
    
    const handleCancelSubscription = async () => {
        setIsCancellingSub(true);
        const result = await cancelSubscription(tenant.code);
        if (result.success) {
            toast({ title: "Subscription Cancelled", description: "The tenant's subscription has been removed."});
            onRefresh();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsCancellingSub(false);
    };


    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Subscription & Invoices</CardTitle>
                        <CardDescription>Manage subscription and invoices for {tenant.name}.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                         {tenant.isSubscriptionActive && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={isCancellingSub}>
                                        {isCancellingSub && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Cancel Subscription
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will remove the tenant's subscription status and amount. This action cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleCancelSubscription}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                         )}
                        <Button onClick={() => handleRecordPayment()}>
                            <DollarSign className="mr-2 h-4 w-4" /> Receive Payment
                        </Button>
                        <Button variant="outline" onClick={handleCreateClick}>
                            <Plus className="mr-2 h-4 w-4" /> 
                            {tenant.isSubscriptionActive ? 'Create Subscription Invoice' : 'Create Invoice'}
                        </Button>
                    </div>
                </div>
                 <div className="grid grid-cols-3 gap-4 text-center mt-4 border rounded-lg p-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Billed</p>
                        <p className="text-xl font-bold">{formatCurrency(financialSummary.totalBilled)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Paid</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(financialSummary.totalPaid)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Balance Due</p>
                        <p className="text-xl font-bold text-red-600">{formatCurrency(financialSummary.totalBilled - financialSummary.totalPaid)}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <DataTable columns={columns({ onEdit: handleEditClick, onView: handleViewClick, onRecordPayment: handleRecordPayment })} data={invoices} />
                )}
                
                <SubscriptionInvoiceDialog
                    isOpen={isInvoiceDialogOpen}
                    setIsOpen={setIsInvoiceDialogOpen}
                    invoice={selectedInvoice}
                    tenant={tenant}
                    onSuccess={handleSuccess}
                    isViewMode={isViewMode}
                />
                
                 <GeneralInvoiceDialog
                    isOpen={isGeneralInvoiceDialogOpen}
                    setIsOpen={setIsGeneralInvoiceDialogOpen}
                    invoice={selectedInvoice}
                    customer={{code: tenant.code, name: tenant.name}}
                    onSuccess={handleSuccess}
                    isViewMode={isViewMode}
                />

                <AddPaymentDialog
                    isOpen={isPaymentDialogOpen}
                    setIsOpen={setIsPaymentDialogOpen}
                    defaultValues={paymentDefaultValues}
                    customerInvoices={invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled' && (i.remainingBalance || 0) > 0)}
                    onPaymentAdded={handleSuccess}
                />
            </CardContent>
        </Card>
    )
}
