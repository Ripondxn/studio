
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { InvoiceDialog } from './invoice-dialog';
import { getInvoicesForCustomer } from './actions';
import { type Invoice } from './schema';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { type Payment } from '@/app/finance/payment/schema';

export function InvoiceList({ customerCode, customerName }: { customerCode: string, customerName: string }) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [paymentDialogDefaults, setPaymentDialogDefaults] = useState<Partial<Omit<Payment, 'id'>> | undefined>();

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        const data = await getInvoicesForCustomer(customerCode);
        setInvoices(data.map(i => ({...i, remainingBalance: i.total - (i.amountPaid || 0)})));
        setIsLoading(false);
    }, [customerCode]);

    useEffect(() => {
        if (customerCode) {
            fetchInvoices();
        }
    }, [customerCode, fetchInvoices]);

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

    const handleRecordPaymentClick = (invoice?: Invoice) => {
        if (invoice) {
             setPaymentDialogDefaults({
                type: 'Receipt',
                partyType: 'Customer',
                partyName: invoice.customerName,
                amount: invoice.remainingBalance,
                invoiceAllocations: [{ invoiceId: invoice.id, amount: invoice.remainingBalance || 0 }],
                remarks: `Payment for Invoice #${invoice.invoiceNo}`
            });
        } else {
             setPaymentDialogDefaults({
                type: 'Receipt',
                partyType: 'Customer',
                partyName: customerName,
                invoiceAllocations: invoices
                    .filter(i => i.status !== 'Paid' && i.status !== 'Cancelled')
                    .map(i => ({ invoiceId: i.id, amount: 0 }))
            });
        }
        setIsPaymentDialogOpen(true);
    }

    const handlePaymentSuccess = () => {
        fetchInvoices();
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>Manage invoices for {customerName}.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button onClick={() => handleRecordPaymentClick()}>Receive Payment</Button>
                        <Button onClick={handleCreateClick}>
                            <Plus className="mr-2 h-4 w-4" /> Create Invoice
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <DataTable columns={columns({ onEdit: handleEditClick, onView: handleViewClick, onRecordPayment: handleRecordPaymentClick })} data={invoices} />
                )}
                {isInvoiceDialogOpen && (
                    <InvoiceDialog
                        isOpen={isInvoiceDialogOpen}
                        setIsOpen={setIsInvoiceDialogOpen}
                        invoice={selectedInvoice}
                        customer={{ code: customerCode, name: customerName }}
                        onSuccess={fetchInvoices}
                        isViewMode={isViewMode}
                    />
                )}
                {isPaymentDialogOpen && (
                    <AddPaymentDialog
                        isOpen={isPaymentDialogOpen}
                        setIsOpen={setIsPaymentDialogOpen}
                        defaultValues={paymentDialogDefaults}
                        onPaymentAdded={handlePaymentSuccess}
                        customerInvoices={invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled')}
                        customerCode={customerCode}
                    />
                )}
            </CardContent>
        </Card>
    )
}
