
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, DollarSign, Edit, Save, X, UserCheck, UserX } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { type Invoice } from './schema';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { type Payment } from '@/app/finance/payment/schema';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/currency-context';
import { type Tenant } from '../../tenants/schema';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cancelSubscription } from '@/app/tenancy/tenants/actions';
import { useToast } from '@/hooks/use-toast';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { useFormContext, type Control } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { getContractLookups, getUnitsForProperty, getRoomsForUnit } from '../../contract/actions';
import { Separator } from '@/components/ui/separator';
import { type Room } from '@/app/property/rooms/schema';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type Unit } from '@/app/property/units/schema';
import { InvoiceDialog } from './invoice-dialog';

interface InvoiceListProps {
    tenant: Tenant;
    invoices: Invoice[];
    isLoading: boolean;
    onRefresh: () => void;
    isSubscriptionEditing: boolean;
    onCreateInvoice: () => void;
}

export function InvoiceList({ tenant, invoices, isLoading, onRefresh, isSubscriptionEditing, onCreateInvoice }: InvoiceListProps) {
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [paymentDefaultValues, setPaymentDefaultValues] = useState<Partial<Omit<Payment, 'id'>>>();
    const router = useRouter();
    const { formatCurrency } = useCurrency();
    
    const handleEditClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsViewMode(false);
        setIsEditInvoiceOpen(true);
    }
    
    const handleViewClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsViewMode(true);
        setIsEditInvoiceOpen(true);
    }
    
    const handleRecordPayment = (invoice?: Invoice) => {
        const openInvoices = invoice ? [invoice] : invoices.filter(inv => inv.status !== 'Paid' && inv.status !== 'Cancelled');
        
        setPaymentDefaultValues({
            type: 'Receipt',
            partyType: 'Customer',
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

    if (!tenant) {
        return <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>Manage invoices for {tenant.name}.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button onClick={() => handleRecordPayment()}>
                            <DollarSign className="mr-2 h-4 w-4" /> Receive Payment
                        </Button>
                        <Button variant="outline" onClick={onCreateInvoice}>
                            <Plus className="mr-2 h-4 w-4" /> Create Invoice
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
                <div className="mt-6">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <DataTable columns={columns({ onEdit: handleEditClick, onView: handleViewClick, onRecordPayment: handleRecordPayment })} data={invoices} />
                    )}
                </div>
                
                <AddPaymentDialog
                    isOpen={isPaymentDialogOpen}
                    setIsOpen={setIsPaymentDialogOpen}
                    defaultValues={paymentDefaultValues}
                    customerInvoices={invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled' && (i.remainingBalance || 0) > 0)}
                    onPaymentAdded={handleSuccess}
                />
                 {isEditInvoiceOpen && (
                    <InvoiceDialog
                        isOpen={isEditInvoiceOpen}
                        setIsOpen={setIsEditInvoiceOpen}
                        invoice={selectedInvoice}
                        customer={{code: tenant.code, name: tenant.name}}
                        onSuccess={handleSuccess}
                        isViewMode={isViewMode}
                    />
                )}
            </CardContent>
        </Card>
    )
}
