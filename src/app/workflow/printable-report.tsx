
'use client';

import React from 'react';
import { format } from 'date-fns';
import { type Payment } from '@/app/finance/payment/schema';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Status } from './types';
import { Building2 } from 'lucide-react';

interface PrintableReportProps {
  transactions: Payment[];
  filters: {
    status: Status | 'ALL';
    user: string;
    from?: Date;
    to?: Date;
  }
}

const statusLabelMap: { [key in Status]: string } = {
  DRAFT: 'Draft',
  PENDING_ADMIN_APPROVAL: 'Pending Admin',
  PENDING_SUPER_ADMIN_APPROVAL: 'Pending Super Admin',
  POSTED: 'Posted',
  REJECTED: 'Rejected',
};

export const PrintableReport = React.forwardRef<HTMLDivElement, PrintableReportProps>(
  ({ transactions, filters }, ref) => {
    
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
      <div ref={ref} className="p-8 bg-white text-black max-w-4xl mx-auto my-4 font-sans">
        <style type="text/css" media="print">
          {`
            @page { size: A4; margin: 1.5cm; }
            body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
            .printable-area { display: flex; flex-direction: column; justify-content: space-between; min-height: 24cm; }
            .printable-table th, .printable-table td { border: 1px solid #e5e7eb !important; padding: 4px 6px; font-size: 9pt; }
            .printable-table th { background-color: #f9fafb !important; }
          `}
        </style>
        <div className="printable-area">
            <div>
                <header className="flex justify-between items-start pb-6 mb-6 border-b border-gray-300">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-lg">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Trust Famous Real Estate</h1>
                            <p className="text-xs text-gray-500">Document Approval Workflow Report</p>
                        </div>
                    </div>
                    <div className="text-right text-xs">
                        <p><span className="font-semibold">Report Date:</span> {format(new Date(), 'PP')}</p>
                        <p><span className="font-semibold">Status:</span> {filters.status}</p>
                        {filters.user && <p><span className="font-semibold">User:</span> {filters.user}</p>}
                        {filters.from && <p><span className="font-semibold">From:</span> {format(filters.from, 'PP')}</p>}
                        {filters.to && <p><span className="font-semibold">To:</span> {format(filters.to, 'PP')}</p>}
                    </div>
                </header>
                
                <Table className="printable-table">
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="border border-gray-300">Date</TableHead>
                            <TableHead className="border border-gray-300">Transaction ID</TableHead>
                            <TableHead className="border border-gray-300">Type</TableHead>
                            <TableHead className="border border-gray-300">Party Name</TableHead>
                            <TableHead className="border border-gray-300">Property</TableHead>
                            <TableHead className="border border-gray-300">Unit</TableHead>
                            <TableHead className="border border-gray-300">Room</TableHead>
                            <TableHead className="border border-gray-300">Reference</TableHead>
                            <TableHead className="border border-gray-300">Created By</TableHead>
                            <TableHead className="border border-gray-300">Status</TableHead>
                            <TableHead className="text-right border border-gray-300">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map(t => (
                            <TableRow key={t.id}>
                                <TableCell className="border border-gray-300">{format(new Date(t.date), 'PP')}</TableCell>
                                <TableCell className="font-mono text-xs border border-gray-300">{t.id}</TableCell>
                                <TableCell className="border border-gray-300">{t.type}</TableCell>
                                <TableCell className="border border-gray-300">{t.partyName}</TableCell>
                                <TableCell className="border border-gray-300">{t.property || '-'}</TableCell>
                                <TableCell className="border border-gray-300">{t.unitCode || '-'}</TableCell>
                                <TableCell className="border border-gray-300">{t.roomCode || '-'}</TableCell>
                                <TableCell className="border border-gray-300">{t.referenceNo || '-'}</TableCell>
                                <TableCell className="border border-gray-300">{t.createdByUser}</TableCell>
                                <TableCell className="border border-gray-300">
                                  <Badge variant="outline">{t.currentStatus ? statusLabelMap[t.currentStatus] : 'N/A'}</Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium border border-gray-300">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.amount)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex justify-end mt-4">
                    <div className="w-full max-w-xs space-y-2 text-sm">
                        <div className="flex justify-between border-t-2 border-gray-800 pt-2 mt-2">
                            <span className="font-bold text-gray-800 text-base">Total Amount:</span>
                            <span className="font-bold text-gray-800 text-base">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-16 pt-8 grid grid-cols-3 gap-8 text-center text-xs text-gray-600">
                <div className="border-t border-gray-400 pt-2">
                    <p className="font-semibold">Prepared By</p>
                </div>
                <div className="border-t border-gray-400 pt-2">
                    <p className="font-semibold">Checked By</p>
                </div>
                <div className="border-t border-gray-400 pt-2">
                    <p className="font-semibold">Approved By</p>
                </div>
            </footer>
        </div>
      </div>
    )
});

PrintableReport.displayName = 'PrintableReport';
