'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal, CheckCircle, Clock, XCircle, FileCheck2, Eye, Printer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { DataTable } from './data-table';
import { paymentColumns } from '@/app/finance/payment/columns';

const statusConfig = {
  PENDING_ADMIN_APPROVAL: { label: 'Pending Admin Approval', color: 'bg-yellow-500/20 text-yellow-700', icon: <Clock className="h-3 w-3" /> },
  PENDING_SUPER_ADMIN_APPROVAL: { label: 'Pending Super Admin Approval', color: 'bg-blue-500/20 text-blue-700', icon: <Clock className="h-3 w-3" /> },
  POSTED: { label: 'Posted', color: 'bg-green-500/20 text-green-700', icon: <CheckCircle className="h-3 w-3" /> },
  REJECTED: { label: 'Rejected', color: 'bg-red-500/20 text-red-700', icon: <XCircle className="h-3 w-3" /> },
};


const ViewCheckoutDialog = ({ checkout }: { checkout: DailyCheckout }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handlePrint = () => {
        // This is a simplified print logic. In a real app, you might use a library or a dedicated printable component.
        const printWindow = window.open('', '', 'height=800,width=800');
        if(printWindow){
            printWindow.document.write('<html><head><title>Checkout Voucher</title>');
            // You can add styles here
            printWindow.document.write('</head><body>');
            printWindow.document.write(`<h1>Checkout Voucher: ${checkout.id}</h1>`);
            printWindow.document.write(`<p>Date: ${format(new Date(checkout.date), 'PPp')}</p>`);
            printWindow.document.write(`<p>Submitted By: ${checkout.submittedBy}</p>`);
            printWindow.document.write(`<p>Total Amount: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(checkout.totalAmount)}</p>`);
            printWindow.document.write(`<p>Status: ${checkout.status}</p>`);
            printWindow.document.write(`<h2>Transactions (${checkout.transactionIds.length})</h2>`);
            // Here you would ideally fetch and display transaction details.
            printWindow.document.write('<ul>');
            checkout.transactionIds.forEach(txId => {
                 printWindow.document.write(`<li>${txId}</li>`);
            })
            printWindow.document.write('</ul>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <div onClick={() => setIsOpen(true)} className="flex items-center w-full">
                    <Eye className="mr-2 h-4 w-4"/> View / Print Voucher
                </div>
            </DropdownMenuItem>
             <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Checkout Voucher: {checkout.id}</DialogTitle>
                    <DialogDescription>
                        Details for the checkout voucher submitted on {format(new Date(checkout.date), 'PP')}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                    <div><span className="font-semibold">Submitted By:</span> {checkout.submittedBy}</div>
                    <div><span className="font-semibold">Total Amount:</span> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(checkout.totalAmount)}</div>
                    <div><span className="font-semibold">Status:</span> <Badge variant="outline" className={cn(statusConfig[checkout.status].color, 'border-transparent')}>{statusConfig[checkout.status].label}</Badge></div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Included Transactions ({checkout.transactionIds.length})</h4>
                    <ul className="list-disc list-inside bg-muted/50 p-4 rounded-md text-sm">
                        {checkout.transactionIds.map(id => <li key={id} className="font-mono">{id}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground italic border p-4 rounded-md">"{checkout.notes || 'No notes provided.'}"</p>
                </div>
                <DialogFooter>
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
    return (
        <div className="text-right">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                     <ViewCheckoutDialog checkout={checkout} />
                </DropdownMenuContent>
            </DropdownMenu>
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
