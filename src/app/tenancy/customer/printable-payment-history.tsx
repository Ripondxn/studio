
'use client';

import React from 'react';
import { format } from 'date-fns';
import { type Payment } from '@/app/finance/payment/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Building2 } from 'lucide-react';

interface PrintablePaymentHistoryProps {
  payments: Payment[];
  customerName: string;
}

export const PrintablePaymentHistory = React.forwardRef<HTMLDivElement, PrintablePaymentHistoryProps>(
  ({ payments, customerName }, ref) => {
    
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

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
                            <p className="text-xs text-gray-500">Payment Receipt History</p>
                        </div>
                    </div>
                    <div className="text-right text-xs">
                        <p><span className="font-semibold">Report Date:</span> {format(new Date(), 'PP')}</p>
                        <p><span className="font-semibold">Customer:</span> {customerName}</p>
                    </div>
                </header>
                
                <Table className="printable-table">
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead>Date</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{format(new Date(p.date), 'PP')}</TableCell>
                                <TableCell>{p.referenceNo || 'N/A'}</TableCell>
                                <TableCell>{p.paymentMethod}</TableCell>
                                <TableCell className="text-right font-medium text-green-700">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.amount)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex justify-end mt-8">
                    <div className="w-full max-w-xs space-y-2 mt-4">
                        <div className="flex justify-between border-t-2 border-gray-800 pt-2 mt-2">
                            <span className="font-bold text-gray-800 text-base">Total Paid:</span>
                            <span className="font-bold text-gray-800 text-base">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPaid)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-16 pt-8 text-center text-xs text-gray-500">
                <p>This is a computer-generated statement and does not require a signature.</p>
            </footer>
        </div>
      </div>
    )
});

PrintablePaymentHistory.displayName = 'PrintablePaymentHistory';
