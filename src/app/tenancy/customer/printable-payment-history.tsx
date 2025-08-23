
'use client';

import React from 'react';
import { format } from 'date-fns';
import { type Payment } from '@/app/finance/payment/schema';
import { type Invoice } from './invoice/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table';
import { Building2 } from 'lucide-react';

interface PrintablePaymentHistoryProps {
  payments: Payment[];
  invoices: Invoice[];
  customerName: string;
}

export const PrintablePaymentHistory = React.forwardRef<HTMLDivElement, PrintablePaymentHistoryProps>(
  ({ payments, invoices, customerName }, ref) => {
    
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    const paymentsByInvoice = payments.reduce((acc, p) => {
        if (p.invoiceAllocations && p.invoiceAllocations.length > 0) {
            p.invoiceAllocations.forEach(alloc => {
                if (!acc[alloc.invoiceId]) {
                    acc[alloc.invoiceId] = [];
                }
                acc[alloc.invoiceId].push({ ...p, allocatedAmount: alloc.amount });
            });
        }
        return acc;
    }, {} as Record<string, (Payment & { allocatedAmount: number })[]>);

    return (
      <div ref={ref} className="p-8 bg-white text-black max-w-4xl mx-auto my-4 font-sans">
        <div className="printable-area">
            <div>
                <header className="flex justify-between items-start pb-6 mb-6 border-b border-gray-300">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-lg">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Trust Famous Real Estate</h1>
                            <p className="text-xs text-gray-500">Statement of Account</p>
                        </div>
                    </div>
                    <div className="text-right text-xs">
                        <p><span className="font-semibold">Report Date:</span> {format(new Date(), 'PP')}</p>
                        <p><span className="font-semibold">Customer:</span> {customerName}</p>
                    </div>
                </header>
                
                {invoices.map(invoice => (
                     <div key={invoice.id} className="mb-8 page-break-before">
                        <div className="p-4 rounded-lg border bg-gray-50 mb-2">
                             <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Invoice No.</p>
                                    <p className="font-semibold">{invoice.invoiceNo}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Invoice Date</p>
                                    <p className="font-semibold">{format(new Date(invoice.invoiceDate), 'PP')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Invoice Amount</p>
                                    <p className="font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.total)}</p>
                                </div>
                                 <div className="text-right">
                                    <p className="text-xs text-gray-500">Balance Due</p>
                                    <p className="font-semibold text-red-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.remainingBalance || 0)}</p>
                                </div>
                            </div>
                        </div>

                         <Table className="printable-table">
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead>Payment Ref</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">Amount Received</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentsByInvoice[invoice.id] && paymentsByInvoice[invoice.id].length > 0 ? (
                                    paymentsByInvoice[invoice.id].map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell>{format(new Date(p.date), 'PP')}</TableCell>
                                            <TableCell>{p.id}</TableCell>
                                            <TableCell>{p.paymentMethod}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.allocatedAmount)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-xs text-gray-500">No payments recorded for this invoice.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-semibold">Total Received for this Invoice</TableCell>
                                    <TableCell className="text-right font-bold">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.amountPaid || 0)}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                     </div>
                ))}

                <div className="flex justify-end mt-8">
                    <div className="w-full max-w-xs space-y-2 mt-4">
                        <div className="flex justify-between border-t-2 border-gray-800 pt-2 mt-2">
                            <span className="font-bold text-gray-800 text-base">Total Paid:</span>
                            <span className="font-bold text-gray-800 text-base">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPaid)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-16 pt-8 grid grid-cols-2 gap-8 text-center text-xs text-gray-600">
                 <div className="border-t border-gray-400 pt-2">
                    <p className="font-semibold">Customer Signature</p>
                </div>
                <div className="border-t border-gray-400 pt-2">
                    <p className="font-semibold">Authorized Signatory</p>
                </div>
            </footer>
        </div>
      </div>
    )
});

PrintablePaymentHistory.displayName = 'PrintablePaymentHistory';
