
'use client';

import { useState, useEffect, useRef } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal, CheckCircle, Clock, XCircle, FileCheck2, Eye, Printer, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
import { getTransactionsByIds } from './actions';
import { type Payment } from '@/app/finance/payment/schema';
import { DataTable } from '@/app/finance/payment/data-table';
import { columns as paymentColumns } from '@/app/finance/payment/columns';

const statusConfig = {
  PENDING_ADMIN_APPROVAL: { label: 'Pending Admin Approval', color: 'bg-yellow-500/20 text-yellow-700', icon: <Clock className="h-3 w-3" /> },
  PENDING_SUPER_ADMIN_APPROVAL: { label: 'Pending Super Admin Approval', color: 'bg-blue-500/20 text-blue-700', icon: <Clock className="h-3 w-3" /> },
  POSTED: { label: 'Posted', color: 'bg-green-500/20 text-green-700', icon: <CheckCircle className="h-3 w-3" /> },
  REJECTED: { label: 'Rejected', color: 'bg-red-500/20 text-red-700', icon: <XCircle className="h-3 w-3" /> },
};


const ViewCheckoutDialog = ({ checkout, isOpen, setIsOpen }: { checkout: DailyCheckout, isOpen: boolean, setIsOpen: (open: boolean) => void }) => {
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(isOpen && checkout.transactionIds.length > 0) {
            setIsLoading(true);
            getTransactionsByIds(checkout.transactionIds)
                .then(setTransactions)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, checkout.transactionIds]);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
             const printWindow = window.open('', '_blank');
            if(printWindow){
                printWindow.document.write('<html><head><title>Checkout Voucher</title>');
                printWindow.document.write('<style>@page { size: A4; margin: 1cm; } body { font-family: sans-serif; -webkit-print-color-adjust: exact; color-adjust: exact; } .printable-content{padding: 1rem;} .printable-header{display:flex; justify-content: space-between; align-items:flex-start; border-bottom: 1px solid #ccc; padding-bottom: 1rem; margin-bottom:1rem;} .printable-title h1{font-size: 1.5rem; font-weight: bold;} .printable-title p{font-size: 0.8rem; color: #666;} .printable-details{text-align:right; font-size:0.8rem;} .printable-grid{display:grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1rem; border: 1px solid #eee; border-radius: 0.5rem; margin-bottom:1rem;} .printable-signatures{display:grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #ccc;} .printable-signatures div{text-align:center;} .printable-signatures p{font-size: 0.8rem; font-weight: bold; padding-top:0.5rem; border-top: 1px solid #666; margin:0 1rem;} table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; font-size: 9pt; } .no-print { display: none; } </style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            }
        }
    }
    
    const columnsWithoutActions = paymentColumns.filter(c => c.id !== 'select' && c.id !== 'actions');

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
             <DialogContent className="max-w-4xl">
                <div ref={printRef} className="printable-content">
                    <DialogHeader className="printable-header">
                        <div className="printable-title">
                            <DialogTitle>Checkout Voucher: {checkout.id}</DialogTitle>
                            <DialogDescription>
                                Details for voucher submitted on {format(new Date(checkout.date), 'PP')}.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <div className="printable-grid grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
                        <div>
                            <div className="font-semibold text-sm text-muted-foreground">Submitted By:</div>
                            <div className="text-base">{checkout.submittedBy}</div>
                        </div>
                        <div>
                            <div className="font-semibold text-sm text-muted-foreground">Total Amount:</div>
                            <div className="font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(checkout.totalAmount)}</div>
                        </div>
                        <div>
                            <div className="font-semibold text-sm text-muted-foreground">Status:</div>
                            <div><Badge variant="outline" className={cn(statusConfig[checkout.status].color, 'border-transparent')}>{statusConfig[checkout.status].label}</Badge></div>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Notes</h4>
                        <div className="text-sm text-muted-foreground italic border p-4 rounded-md">"{checkout.notes || 'No notes provided.'}"</div>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Included Transactions ({checkout.transactionIds.length})</h4>
                        {isLoading ? (
                             <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                             <DataTable columns={columnsWithoutActions} data={transactions} />
                        )}
                    </div>
                     <div className="printable-signatures grid grid-cols-3 gap-8 mt-16 pt-8 border-t">
                        <div className="flex flex-col items-center"><p>Prepared by</p></div>
                        <div className="flex flex-col items-center"><p>Checked by</p></div>
                        <div className="flex flex-col items-center"><p>Approved by</p></div>
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
