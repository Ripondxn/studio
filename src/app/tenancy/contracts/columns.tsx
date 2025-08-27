'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, differenceInDays, formatDistanceToNowStrict, isFuture, parseISO } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteContract } from '../contract/actions';
import { Contract } from '../contract/schema';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/context/currency-context';

const ActionsCell = ({ row }: { row: { original: Contract } }) => {
  const contract = row.original;
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteContract(contract.id);
      if (result.success) {
        toast({
          title: 'Success',
          description: `Contract "${contract.contractNo}" deleted successfully.`,
        });
        router.refresh();
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to delete contract.',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contract "{contract.contractNo}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/tenancy/contract?id=${contract.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

const DaysPassedCell = ({ row }: { row: { original: Contract } }) => {
    const { startDate } = row.original;
    const [passed, setPassed] = useState<{ text: string, className: string }>({ text: '', className: '' });

    useEffect(() => {
        try {
            const start = new Date(startDate);
            if (isFuture(start)) {
                setPassed({ text: 'Starts soon', className: 'text-blue-600' });
                return;
            }
            const now = new Date();
            const days = differenceInDays(now, start);
            
            setPassed({ 
                text: `${days} days`,
                className: ''
            });

        } catch (e) {
            setPassed({text: 'Invalid date', className: 'text-muted-foreground'});
        }
    }, [startDate]);

    return <span className={cn('font-medium', passed.className)}>{passed.text}</span>;
}


const RemainingDaysCell = ({ row }: { row: { original: Contract } }) => {
    const { endDate } = row.original;
    const [remaining, setRemaining] = useState<{ text: string, className: string }>({ text: '', className: '' });
  
    useEffect(() => {
        try {
            const end = new Date(endDate);
            const now = new Date();
            const days = differenceInDays(end, now);
            
            if (days < 0) {
                setRemaining({ 
                    text: `Expired ${formatDistanceToNowStrict(end, { addSuffix: true })}`,
                    className: 'text-destructive'
                });
            } else if (days <= 30) {
                 setRemaining({ 
                    text: days === 0 ? 'Expires today' : `${days} days`,
                    className: 'text-emerald-600'
                });
            } else {
                 setRemaining({ 
                    text: `${days} days`,
                    className: ''
                });
            }
        } catch (e) {
            setRemaining({text: 'Invalid date', className: 'text-muted-foreground'});
        }
    }, [endDate]);

    return <span className={cn('font-bold', remaining.className)}>{remaining.text}</span>;
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
  New: 'default',
  Renew: 'secondary',
  Cancel: 'destructive',
};

export const columns: ColumnDef<Contract & {periodStatus?: string}>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'contractNo',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Tracking Num...
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'tenantName',
    header: 'Tenant',
  },
  {
    accessorKey: 'property',
    header: 'Property',
  },
  {
    accessorKey: 'unitCode',
    header: 'Unit',
  },
  {
    accessorKey: 'endDate',
    header: 'Contract End',
     cell: ({ row }) => format(new Date(row.getValue('endDate')), 'PP'),
  },
  {
    id: 'remainingDays',
    header: 'Remaining Days',
    cell: RemainingDaysCell,
  },
  {
    accessorKey: 'totalRent',
    header: () => <div className="text-right">Rent Amount</div>,
    cell: function Cell({ row }) {
      const { formatCurrency } = useCurrency();
      const amount = parseFloat(row.getValue('totalRent'));
      
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const contract = row.original;
        const status = contract.status || 'New';
        const renewalCount = contract.renewalCount || 0;
        let statusText = status;

        if (status === 'Renew' && renewalCount > 0) {
            statusText = `Renew (x${renewalCount})`;
        }
        
        return <Badge variant={statusVariantMap[status] || 'default'} className="capitalize">{statusText}</Badge>;
    }
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
