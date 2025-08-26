

'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, User, Building, Wrench, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Payment } from './schema';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { cancelPayment, restorePayment } from './actions';
import { useRouter } from 'next/navigation';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { useCurrency } from '@/context/currency-context';


const partyTypeConfig: {
  [key in Payment['partyType']]: {
    icon: React.ReactNode;
  };
} = {
  'Tenant': { icon: <User className="h-3 w-3" /> },
  'Landlord': { icon: <Building className="h-3 w-3" /> },
  'Vendor': { icon: <Wrench className="h-3 w-3" /> },
  'Customer': { icon: <User className="h-3 w-3" /> },
};


const ActionsCell = ({ row }: { row: { original: Payment } }) => {
    const payment = row.original;
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<UserRole['role'] | null>(null);

    useEffect(() => {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            setCurrentUserRole(JSON.parse(storedProfile).role);
        }
    }, []);

    const handleCancel = async () => {
        setIsCancelling(true);
        const result = await cancelPayment(payment.id!);
        if(result.success) {
            const { id } = toast({ 
                title: "Payment Cancelled",
                description: "The transaction has been cancelled.",
                action: (
                    <Button variant="outline" size="sm" onClick={async () => {
                       const restoreResult = await restorePayment(payment.id!);
                       if(restoreResult.success) {
                           toast({ title: 'Undo Successful', description: 'The payment has been restored.'});
                           router.refresh();
                       } else {
                           toast({ variant: 'destructive', title: 'Undo Failed', description: restoreResult.error});
                       }
                       id && toast({id}).dismiss();
                    }}>Undo</Button>
                )
            });
            router.refresh(); // Refresh data on the page
        } else {
             toast({ variant: 'destructive', title: "Error", description: result.error || 'Failed to cancel payment.'});
        }
        setIsCancelling(false);
        setIsDeleteDialogOpen(false);
    }
    
    const canDelete = (): boolean => {
        if (currentUserRole === 'Super Admin') return true;
        // Allow cancelling posted transactions, but permanent deletion only for drafts
        return payment.currentStatus !== 'POSTED';
    }
    
    return (
        <>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will cancel the payment and reverse its financial impact. You can undo this action from the toast notification.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel} disabled={isCancelling} className="bg-destructive hover:bg-destructive/90">
                            {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => alert('Edit functionality coming soon!')} disabled={payment.currentStatus !== 'DRAFT'}>
                        <Edit className="mr-2 h-4 w-4"/> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onSelect={() => setIsDeleteDialogOpen(true)} disabled={!canDelete()}>
                        <Trash2 className="mr-2 h-4 w-4"/> Cancel Transaction
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
        const type = row.original.type;
        const color = type === 'Receipt' ? 'text-green-600' : 'text-red-600';
        return <span className={cn('font-medium', color)}>{type}</span>
    }
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
     cell: ({ row }) => format(new Date(row.getValue('date')), 'PP'),
  },
  {
    accessorKey: 'partyName',
    header: 'Party',
    cell: ({ row }) => {
        const partyType = row.original.partyType;
        const config = partyTypeConfig[partyType];
        return (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.partyName}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">{config.icon}{partyType}</span>
            </div>
        )
    }
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: function Cell({ row }) {
      const { formatCurrency } = useCurrency();
      const amount = parseFloat(row.getValue('amount'));

      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
   {
    accessorKey: 'paymentMethod',
    header: 'Method',
  },
  {
    accessorKey: 'bankAccountId',
    header: 'Bank Account',
    cell: ({ row }) => {
        // In a real app, you would look up the bank account name by its ID.
        // For now, we just display the ID if it exists.
        return row.original.bankAccountId || <span className="text-muted-foreground">N/A</span>;
    }
  },
  {
    accessorKey: 'referenceNo',
    header: 'Reference',
  },
  {
    accessorKey: 'createdByUser',
    header: 'By User Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Payment['status'];
      const variant = status === 'Cancelled' ? 'destructive' : 'secondary';
      const color = status === 'Received' ? 'bg-green-500/20 text-green-700' : status === 'Paid' ? 'bg-blue-500/20 text-blue-700' : '';
      return <Badge variant={variant} className={cn(color, 'border-transparent')}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
