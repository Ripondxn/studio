

'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, DollarSign } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { InvoiceDialog } from './invoice-dialog';
import { type Invoice } from './schema';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { type Payment } from '@/app/finance/payment/schema';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/currency-context';

interface InvoiceListProps {
    customerCode: string;
    customerName: string;
    invoices: Invoice[];
    isLoading: boolean;
    onRefresh: () => void;
}

export function InvoiceList({ customerCode, customerName, invoices, isLoading, onRefresh }: InvoiceListProps) {
    const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [paymentDefaultValues, setPaymentDefaultValues] = useState<Partial<Omit<Payment, 'id'>>>();
    const router = useRouter();
    const { formatCurrency } = useCurrency();
    
    const handleCreateClick = () => {
        setSelectedInvoice(null);
        setIsViewMode(false);
        setIsInvoiceDialogOpen(true);
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
            partyType: 'Customer',
            partyName: customerCode,
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


    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Subscription Invoices</CardTitle>
                        <CardDescription>Manage invoices for {customerName}.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button onClick={() => handleRecordPayment()}>
                            <DollarSign className="mr-2 h-4 w-4" /> Receive Payment
                        </Button>
                        <Button variant="outline" onClick={handleCreateClick}>
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
                {isLoading ? (
                     <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <DataTable columns={columns({ onEdit: handleEditClick, onView: handleViewClick, onRecordPayment: handleRecordPayment })} data={invoices} />
                )}
                
                <InvoiceDialog
                    isOpen={isInvoiceDialogOpen}
                    setIsOpen={setIsInvoiceDialogOpen}
                    invoice={selectedInvoice}
                    tenant={{ code: customerCode, name: customerName }}
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
