

'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash, FileText, DollarSign } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { type Invoice } from './schema';
import { deleteInvoice } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export const columns = ({ onEdit, onView, onRecordPayment }: { onEdit: (invoice: Invoice) => void, onView: (invoice: Invoice) => void, onRecordPayment: (invoice: Invoice) => void }): ColumnDef<Invoice>[] => {
  
  const ActionsCell = ({ row }: { row: { original: Invoice } }) => {
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteInvoice(row.original.id);
        if (result.success) {
            toast({ title: 'Invoice Deleted' });
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsDeleting(false);
    }

    const isPaidOrCancelled = row.original.status === 'Paid' || row.original.status === 'Cancelled';

    return (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(row.original)}><FileText className="mr-2 h-4 w-4" /> View/Print</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(row.original)} disabled={isPaidOrCancelled}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onRecordPayment(row.original)} disabled={isPaidOrCancelled}>
                        <DollarSign className="mr-2 h-4 w-4" /> Record Payment
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete invoice {row.original.invoiceNo}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
  }

  const statusVariantMap: { [key in Invoice['status']]: string } = {
    Draft: 'bg-gray-500/20 text-gray-700',
    Sent: 'bg-blue-500/20 text-blue-700',
    Overdue: 'bg-red-500/20 text-red-700',
    Paid: 'bg-green-500/20 text-green-700',
    Cancelled: 'bg-gray-500/20 text-gray-700 line-through'
  };


  return [
      {
          accessorKey: 'invoiceNo',
          header: 'Invoice #',
      },
      {
          accessorKey: 'invoiceDate',
          header: 'Date',
          cell: ({ row }) => format(new Date(row.original.invoiceDate), 'PP'),
      },
      {
          accessorKey: 'dueDate',
          header: 'Due Date',
          cell: ({ row }) => format(new Date(row.original.dueDate), 'PP'),
      },
      {
          accessorKey: 'unitCode',
          header: 'Unit',
          cell: ({row}) => {
            const invoice = row.original;
            if (invoice.roomCode) {
              return <span>{invoice.unitCode} / {invoice.roomCode}</span>
            }
            return invoice.unitCode;
          }
      },
      {
          accessorKey: 'total',
          header: () => <div className="text-right">Total</div>,
          cell: ({ row }) => <div className="text-right font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.total)}</div>
      },
      {
          accessorKey: 'amountPaid',
          header: () => <div className="text-right">Amount Paid</div>,
          cell: ({ row }) => <div className="text-right font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.amountPaid || 0)}</div>
      },
       {
          accessorKey: 'remainingBalance',
          header: () => <div className="text-right">Balance</div>,
          cell: ({ row }) => <div className="text-right font-medium text-red-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.remainingBalance || 0)}</div>
      },
      {
          accessorKey: 'status',
          header: 'Status',
          cell: ({ row }) => <Badge variant="outline" className={cn(statusVariantMap[row.original.status], 'border-transparent')}>{row.original.status}</Badge>,
      },
      {
          id: 'actions',
          cell: ActionsCell,
      }
  ];
}
