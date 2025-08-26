'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Product } from './schema';
import { AddProductDialog } from './add-product-dialog';
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
import { deleteProduct } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/context/currency-context';
import { Badge } from '@/components/ui/badge';

const ActionsCell = ({ row, onProductUpdate }: { row: { original: Product }, onProductUpdate: () => void }) => {
    const product = row.original;
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteProduct(product.id);
        if (result.success) {
            toast({ title: 'Success', description: 'Item has been deleted.' });
            onProductUpdate();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    };
    
    return (
        <>
            <AddProductDialog 
                product={product} 
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                onProductAdded={onProductUpdate}
            >
                 <span className="w-full"/>
            </AddProductDialog>
             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the item "{product.itemName}".</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
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
                    <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onSelect={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};


export const columns = ({ onProductUpdate }: { onProductUpdate: () => void }): ColumnDef<Product>[] => [
    {
      accessorKey: 'itemCode',
      header: 'Item Code',
    },
    {
      accessorKey: 'itemName',
      header: 'Item Name',
    },
    {
        accessorKey: 'itemType',
        header: 'Type',
        cell: ({row}) => {
            const type = row.original.itemType;
            return <Badge variant={type === 'Service' ? 'secondary' : 'outline'}>{type}</Badge>
        }
    },
    {
      accessorKey: 'salePrice',
      header: () => <div className="text-right">Sale Price</div>,
      cell: function Cell({ row }) {
        const { formatCurrency } = useCurrency();
        const amount = parseFloat(String(row.getValue('salePrice')));
        return <div className="text-right font-medium">{formatCurrency(amount)}</div>
      },
    },
    {
      accessorKey: 'costPrice',
      header: () => <div className="text-right">Cost Price</div>,
      cell: function Cell({ row }) {
        const { formatCurrency } = useCurrency();
        const amount = parseFloat(String(row.getValue('costPrice')));
        return <div className="text-right font-medium">{formatCurrency(amount)}</div>
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <ActionsCell row={row} onProductUpdate={onProductUpdate} />,
    },
];
