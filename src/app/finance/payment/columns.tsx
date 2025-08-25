
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
import { deletePayment } from './actions';
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<UserRole['role'] | null>(null);

    useEffect(() => {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            setCurrentUserRole(JSON.parse(storedProfile).role);
        }
    }, []);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deletePayment(payment.id!);
        if(result.success) {
            toast({ title: "Success", description: "Payment has been deleted."});
            router.refresh(); // Refresh data on the page
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.error || 'Failed to delete payment.'});
        }
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    }
    
    const canDelete = (): boolean => {
        if (currentUserRole === 'Super Admin') return true;
        return payment.currentStatus !== 'POSTED';
    }
    
    return (
        <>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the payment and reverse its financial impact.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                            {isDeleting ? 'Deleting...' : 'Delete'}
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
                        <Trash2 className="mr-2 h-4 w-4"/> Delete
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
