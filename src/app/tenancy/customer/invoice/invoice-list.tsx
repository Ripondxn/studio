
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

    const handleAddClick = () => {
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
        setSelectedInvoice(invoice || null);
        setIsPaymentDialogOpen(true);
    }

    const handlePaymentSuccess = () => {
        fetchInvoices();
    }
    
    const paymentDefaultValues: Partial<Omit<Payment, 'id'>> | undefined = selectedInvoice ? {
        type: 'Receipt',
        partyType: 'Customer',
        partyName: selectedInvoice.customerName,
        amount: selectedInvoice.remainingBalance,
        referenceNo: selectedInvoice.invoiceNo,
        remarks: `Payment for Invoice #${selectedInvoice.invoiceNo}`
    } : {
        type: 'Receipt',
        partyType: 'Customer',
        partyName: customerName,
    };

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
                        <Button onClick={handleAddClick}>
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
                <InvoiceDialog
                    isOpen={isInvoiceDialogOpen}
                    setIsOpen={setIsInvoiceDialogOpen}
                    invoice={selectedInvoice}
                    customer={{ code: customerCode, name: customerName }}
                    onSuccess={fetchInvoices}
                    isViewMode={isViewMode}
                />
                <AddPaymentDialog
                    isOpen={isPaymentDialogOpen}
                    setIsOpen={setIsPaymentDialogOpen}
                    defaultValues={paymentDefaultValues}
                    onPaymentAdded={handlePaymentSuccess}
                    customerInvoices={invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled')}
                    customerCode={customerCode}
                />
            </CardContent>
        </Card>
    )
}
