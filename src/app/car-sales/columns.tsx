
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { type Vehicle } from './schema';
import { useCurrency } from '@/context/currency-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { deleteVehicle } from './actions';
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

const ActionsCell = ({ row, onEdit, onUpdate }: { row: { original: Vehicle }, onEdit: (vehicle: Vehicle) => void, onUpdate: () => void }) => {
    const vehicle = row.original;
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteVehicle(vehicle.id);
        if (result.success) {
            toast({ title: 'Success', description: 'Vehicle record has been deleted.' });
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
                        <AlertDialogDescription>This will permanently delete the record for {vehicle.make} {vehicle.model}.</AlertDialogDescription>
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
                    <DropdownMenuItem onSelect={() => onEdit(vehicle)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onSelect={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export const columns = ({ onEdit, onUpdate }: { onEdit: (vehicle: Vehicle) => void, onUpdate: () => void }): ColumnDef<Vehicle>[] => [
    {
        accessorKey: 'stockNo',
        header: 'Stock #',
    },
    {
        accessorKey: 'make',
        header: 'Make',
    },
    {
        accessorKey: 'model',
        header: 'Model',
    },
    {
        accessorKey: 'year',
        header: 'Year',
    },
    {
        accessorKey: 'purchasePrice',
        header: () => <div className="text-right">Purchase Price</div>,
        cell: function Cell({ row }) {
            const { formatCurrency } = useCurrency();
            return <div className="text-right font-medium">{formatCurrency(row.original.purchasePrice || 0)}</div>;
        }
    },
    {
        accessorKey: 'salePrice',
        header: () => <div className="text-right">Sale Price</div>,
        cell: function Cell({ row }) {
            const { formatCurrency } = useCurrency();
            return <div className="text-right font-medium">{formatCurrency(row.original.salePrice || 0)}</div>;
        }
    },
    {
        accessorKey: 'profitOrLoss',
        header: () => <div className="text-right">Profit/Loss</div>,
        cell: function Cell({ row }) {
            const { formatCurrency } = useCurrency();
            const profitOrLoss = row.original.profitOrLoss || 0;
            const colorClass = profitOrLoss >= 0 ? 'text-green-600' : 'text-red-600';
            return <div className={`text-right font-bold ${colorClass}`}>{formatCurrency(profitOrLoss)}</div>;
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge variant={row.original.status === 'Sold' ? 'secondary' : 'default'}>{row.original.status}</Badge>
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionsCell row={row} onEdit={onEdit} onUpdate={onUpdate} />,
    }
];
