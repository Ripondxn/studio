
'use client';

import React from 'react';
import { format } from 'date-fns';
import { type Payment } from '@/app/finance/payment/schema';
import { type Invoice } from './schema';
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
import { useCurrency } from '@/context/currency-context';
import { useCompanyProfile } from '@/context/company-profile-context';

interface PrintablePaymentHistoryProps {
  payments: Payment[];
  invoices: Invoice[];
  customerName: string;
}

export const PrintablePaymentHistory = React.forwardRef<HTMLDivElement, PrintablePaymentHistoryProps>(
  ({ payments, invoices, customerName }, ref) => {
    const { formatCurrency } = useCurrency();
    const { profile } = useCompanyProfile();
    
    const paymentsByInvoice = payments.reduce((acc, p) => {
        if (p.invoiceAllocations && p.invoiceAllocations.length > 0) {
            p.invoiceAllocations.forEach(alloc => {
                if (alloc.amount > 0) { // Only include allocations with an amount
                    if (!acc[alloc.invoiceId]) {
                        acc[alloc.invoiceId] = [];
                    }
                    acc[alloc.invoiceId].push({ ...p, allocatedAmount: alloc.amount });
                }
            });
        }
        return acc;
    }, {} as Record<string, (Payment & { allocatedAmount: number })[]>);

    return (
      <div ref={ref} className="p-8 bg-white text-black max-w-4xl mx-auto my-4 font-sans">
        <style type="text/css" media="print">
          {`
            @page { size: A4; margin: 1.5cm; }
            body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
            .printable-area { display: block; }
            .page-break-before { page-break-before: always; }
            .invoice-summary-table, .payments-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
            .invoice-summary-table th, .invoice-summary-table td, .payments-table th, .payments-table td { border: 1px solid #dee2e6 !important; padding: 0.5rem; font-size: 9pt; }
            .invoice-summary-table th { background-color: #cfe2f3 !important; } /* Light Blue */
            .payments-table th { background-color: #d9ead3 !important; } /* Light Green */
          `}
        </style>
        <div className="printable-area">
            <header className="flex justify-between items-start pb-6 mb-6 border-b border-gray-300">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                         {profile.logo ? <img src={profile.logo} alt="Company Logo" className="h-8 w-8 object-contain"/> : <Building2 className="h-8 w-8" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                        <p className="text-xs text-gray-500">Statement of Account</p>
                    </div>
                </div>
                <div className="text-right text-xs">
                    <p><span className="font-semibold">Report Date:</span> {format(new Date(), 'PP')}</p>
                    <p><span className="font-semibold">Customer:</span> {customerName}</p>
                </div>
            </header>
            
            {invoices.map(invoice => (
                 <div key={invoice.id} className="mb-8 page-break-before:mt-8">
                    <table className="invoice-summary-table">
                        <tbody>
                            <TableRow>
                                <TableCell className="font-semibold">Invoice No</TableCell>
                                <TableCell>{invoice.invoiceNo}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-semibold">Amount</TableCell>
                                <TableCell>{formatCurrency(invoice.total)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-semibold">Balance</TableCell>
                                <TableCell>{formatCurrency(invoice.remainingBalance || 0)}</TableCell>
                            </TableRow>
                        </tbody>
                    </table>

                     <Table className="payments-table">
                        <TableHeader>
                            <TableRow>
                                <TableHead>SN</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Receipt No</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Reference No</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paymentsByInvoice[invoice.id] && paymentsByInvoice[invoice.id].length > 0 ? (
                                paymentsByInvoice[invoice.id].map((p, index) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{format(new Date(p.date), 'dd/M/yyyy')}</TableCell>
                                        <TableCell>{p.id}</TableCell>
                                        <TableCell>{formatCurrency(p.allocatedAmount)}</TableCell>
                                        <TableCell>{p.referenceNo}</TableCell>
                                        <TableCell>{p.status}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-xs text-gray-500">No payments recorded for this invoice.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-bold">Total Amount Received =</TableCell>
                                <TableCell className="font-bold">
                                    {formatCurrency(invoice.amountPaid || 0)}
                                </TableCell>
                                <TableCell colSpan={2}></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                 </div>
            ))}

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
