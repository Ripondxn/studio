
'use client';

import { useState, useEffect, useRef } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal, CheckCircle, Clock, XCircle, FileCheck2, Eye, Printer, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { type DailyCheckout } from './schema';
import { cn } from '@/lib/utils';
import { getTransactionsByIds } from './actions';
import { type Payment } from '@/app/finance/payment/schema';
import { PrintableReport } from './printable-report';
import { getPartyNameLookups } from '../payment/actions';

const statusConfig = {
  PENDING_ADMIN_APPROVAL: { label: 'Pending Admin Approval', color: 'bg-yellow-500/20 text-yellow-700', icon: <Clock className="h-3 w-3" /> },
  PENDING_SUPER_ADMIN_APPROVAL: { label: 'Pending Super Admin Approval', color: 'bg-blue-500/20 text-blue-700', icon: <Clock className="h-3 w-3" /> },
  POSTED: { label: 'Posted', color: 'bg-green-500/20 text-green-700', icon: <CheckCircle className="h-3 w-3" /> },
  REJECTED: { label: 'Rejected', color: 'bg-red-500/20 text-red-700', icon: <XCircle className="h-3 w-3" /> },
};


const ViewCheckoutDialog = ({ checkout, isOpen, setIsOpen }: { checkout: DailyCheckout, isOpen: boolean, setIsOpen: (open: boolean) => void }) => {
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [partyNameLookups, setPartyNameLookups] = useState<Record<string, string>>({});
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(isOpen && checkout.transactionIds.length > 0) {
            setIsLoading(true);
            Promise.all([
                getTransactionsByIds(checkout.transactionIds),
                getPartyNameLookups()
            ]).then(([transactionsData, lookupsData]) => {
                setTransactions(transactionsData);
                setPartyNameLookups(lookupsData);
            }).finally(() => setIsLoading(false));
        }
    }, [isOpen, checkout.transactionIds]);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
             const printWindow = window.open('', '_blank');
            if(printWindow){
                printWindow.document.write('<html><head><title>Checkout Voucher</title>');
                printWindow.document.write('<style>body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }</style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                setTimeout(() => printWindow.print(), 500);
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
             <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Checkout Voucher: {checkout.id}</DialogTitle>
                    <DialogDescription>
                        Details for voucher submitted on {format(new Date(checkout.date), 'PP')}.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto">
                    <div className="printable-content p-4" ref={printRef}>
                       <PrintableReport 
                         transactions={transactions} 
                         filters={{ status: 'ALL', user: checkout.submittedBy, from: undefined, to: undefined }} 
                         partyNameLookups={partyNameLookups} 
                        />
                    </div>
                </div>
                <DialogFooter className="no-print">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4"/> Print
                    </Button>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const ActionsCell = ({ row }: { row: { original: DailyCheckout } }) => {
    const checkout = row.original;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <div className="text-right">
            <ViewCheckoutDialog checkout={checkout} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
                <Eye className="mr-2 h-4 w-4"/> View/Print
            </Button>
        </div>
    )
}

export const columns: ColumnDef<DailyCheckout>[] = [
    {
        accessorKey: 'id',
        header: 'Voucher ID'
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.original.date), 'PP')
    },
    {
        accessorKey: 'submittedBy',
        header: 'Submitted By'
    },
    {
        accessorKey: 'totalAmount',
        header: () => <div className="text-right">Total Amount</div>,
        cell: ({ row }) => <div className="text-right font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.totalAmount)}</div>
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;
            const config = statusConfig[status];
            return <Badge variant="outline" className={cn('gap-1', config.color, 'border-transparent')}>{config.icon}{config.label}</Badge>;
        }
    },
    {
        id: 'actions',
        cell: ActionsCell
    }
];
