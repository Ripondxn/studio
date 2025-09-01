
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { type Rental } from './schema';
import { format } from 'date-fns';
import { useCurrency } from '@/context/currency-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { deleteRental } from './actions';
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


const ActionsCell = ({ row, onEdit, onUpdate }: { row: { original: Rental }, onEdit: (rental: Rental) => void, onUpdate: () => void }) => {
    const rental = row.original;
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteRental(rental.id);
        if (result.success) {
            toast({ title: 'Success', description: 'Rental agreement has been deleted.' });
            onUpdate();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    };

    return (
        <>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete the agreement "{rental.contractNo}".</AlertDialogDescription>
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
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => onEdit(rental)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onSelect={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}


export const columns = ({ onEdit, onUpdate }: { onEdit: (rental: Rental) => void, onUpdate: () => void }): ColumnDef<Rental>[] => [
    {
        accessorKey: 'rentalType',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.original.rentalType;
            return <Badge variant={type === 'Hired' ? 'outline' : 'secondary'}>{type}</Badge>
        }
    },
    {
        accessorKey: 'contractNo',
        header: 'Contract No',
    },
    {
        accessorKey: 'partyName',
        header: 'Party Name'
    },
    {
        accessorKey: 'carDetails',
        header: 'Car Details',
    },
    {
        accessorKey: 'plateNumber',
        header: 'Plate No.',
    },
    {
        accessorKey: 'startDate',
        header: 'Start Date',
        cell: ({ row }) => format(new Date(row.original.startDate), 'PP'),
    },
    {
        accessorKey: 'endDate',
        header: 'End Date',
        cell: ({ row }) => format(new Date(row.original.endDate), 'PP'),
    },
    {
        accessorKey: 'rentalAmount',
        header: () => <div className="text-right">Amount/Month</div>,
        cell: function Cell({ row }) {
            const { formatCurrency } = useCurrency();
            return <div className="text-right font-medium">{formatCurrency(row.original.rentalAmount)}</div>;
        }
    },
     {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;
            return <Badge variant={status === 'Active' ? 'default' : status === 'Completed' ? 'secondary' : 'destructive'}>{status}</Badge>
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionsCell row={row} onEdit={onEdit} onUpdate={onUpdate} />,
    }
];
