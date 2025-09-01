
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, DollarSign } from 'lucide-react';
import { type UtilityAccount } from './schema';
import { deleteUtilityAccount } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
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
import { useCurrency } from '@/context/currency-context';

export const columns = ({ onEdit, onRecordBill }: { onEdit: (account: UtilityAccount) => void; onRecordBill: (account: UtilityAccount) => void; }): ColumnDef<UtilityAccount>[] => {
  
    const ActionsCell = ({ row }: { row: { original: UtilityAccount } }) => {
        const { toast } = useToast();
        const router = useRouter();
        const [isDeleting, setIsDeleting] = useState(false);
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
        const account = row.original;

        const handleDelete = async () => {
            setIsDeleting(true);
            const result = await deleteUtilityAccount(account.id);
            if(result.success) {
                toast({ title: 'Success', description: 'Utility account deleted.' });
                router.refresh();
            } else {
                 toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
        
        return (
            <>
                 <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This action will permanently delete the utility account.</AlertDialogDescription>
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
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onRecordBill(account)}>
                            <DollarSign className="mr-2 h-4 w-4" /> Record Bill
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onEdit(account)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        )
    }


    return [
    {
        accessorKey: 'utilityType',
        header: 'Utility Type',
    },
    {
        accessorKey: 'provider',
        header: 'Provider',
    },
    {
        accessorKey: 'accountNumber',
        header: 'Account Number',
    },
    {
        accessorKey: 'propertyCode',
        header: 'Property',
    },
     {
        accessorKey: 'unitCode',
        header: 'Unit',
        cell: ({ row }) => row.original.unitCode || <span className="text-muted-foreground">N/A</span>
    },
     {
        accessorKey: 'totalPaid',
        header: () => <div className="text-right">Total Paid</div>,
        cell: function Cell({ row }) {
            const { formatCurrency } = useCurrency();
            const amount = row.original.totalPaid || 0;
            return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge variant={row.original.status === 'Active' ? 'default' : 'secondary'}>{row.original.status}</Badge>,
    },
    {
        id: 'actions',
        cell: ActionsCell,
    }
    ]
}
