
'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, differenceInDays, formatDistanceToNowStrict } from 'date-fns';

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

export const columns: ColumnDef<Contract>[] = [
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
    accessorKey: 'contractDate',
    header: 'Contract Date',
    cell: ({ row }) => format(new Date(row.getValue('contractDate')), 'PP'),
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
    accessorKey: 'tenantName',
    header: 'Tenant',
  },
  {
    accessorKey: 'startDate',
    header: 'Contract Start...',
    cell: ({ row }) => format(new Date(row.getValue('startDate')), 'PP'),
  },
  {
    accessorKey: 'endDate',
    header: 'Contract End...',
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
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalRent'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant={statusVariantMap[status] || 'default'} className="capitalize">{status}</Badge>;
    }
  },
   {
    accessorKey: 'terminationDate',
    header: 'Termination D...',
    cell: ({row}) => {
        const value = row.getValue('terminationDate') as string;
        return value ? format(new Date(value), 'PP') : '';
    }
  },
   {
    accessorKey: 'rentBasedOn',
    header: 'Rent Based On',
    cell: ({ row }) => <span className="capitalize">{row.getValue('rentBasedOn')}</span>,
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
