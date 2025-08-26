
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2, History, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { type Asset } from './schema';
import { AddAssetDialog } from './add-asset-dialog';
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
import { deleteAsset } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/context/currency-context';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UpdateStatusDialog } from './update-status-dialog';

const statusConfig: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline', className: string } } = {
  'In Stock': { variant: 'default', className: 'bg-green-100 text-green-800' },
  'Assigned': { variant: 'secondary', className: 'bg-blue-100 text-blue-800' },
  'Damaged': { variant: 'destructive', className: '' },
  'Out for Repair': { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' },
  'Retired': { variant: 'secondary', className: 'bg-gray-100 text-gray-800' },
};

const ActionsCell = ({ row, onAssetUpdate }: { row: { original: Asset }, onAssetUpdate: () => void }) => {
    const asset = row.original;
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteAsset(asset.id);
        if (result.success) {
            toast({ title: 'Success', description: 'Asset has been deleted.' });
            onAssetUpdate();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    };
    
    return (
        <>
            <AddAssetDialog 
                asset={asset} 
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                onAssetAdded={onAssetUpdate}
            >
                 <span className="w-full"/>
            </AddAssetDialog>
            <UpdateStatusDialog
                asset={asset}
                isOpen={isStatusDialogOpen}
                setIsOpen={setIsStatusDialogOpen}
                onSuccess={onAssetUpdate}
            />
             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the asset "{asset.assetName}".</AlertDialogDescription>
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
                    <DropdownMenuItem onSelect={() => setIsStatusDialogOpen(true)}>
                        <RotateCw className="mr-2 h-4 w-4" /> Update Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => alert('History view coming soon!')}>
                        <History className="mr-2 h-4 w-4" /> View History
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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


export const columns = ({ onAssetUpdate }: { onAssetUpdate: () => void }): ColumnDef<Asset>[] => [
    {
      accessorKey: 'assetCode',
      header: 'Asset Code',
    },
    {
      accessorKey: 'assetName',
      header: 'Asset Name',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: function Cell({ row }) {
        const status = row.original.status || 'In Stock';
        const config = statusConfig[status] || statusConfig['In Stock'];
        return <Badge variant={config.variant} className={cn(config.className, 'border-transparent')}>{status}</Badge>
      },
    },
     {
      accessorKey: 'assignedTo',
      header: 'Assigned To',
      cell: ({ row }) => row.original.assignedTo || <span className="text-muted-foreground">N/A</span>,
    },
    {
      accessorKey: 'purchaseDate',
      header: 'Purchase Date',
    },
    {
      accessorKey: 'purchaseCost',
      header: () => <div className="text-right">Cost</div>,
      cell: function Cell({ row }) {
        const { formatCurrency } = useCurrency();
        const amount = parseFloat(String(row.getValue('purchaseCost')));
        return <div className="text-right font-medium">{formatCurrency(amount)}</div>
      },
    },
    {
      accessorKey: 'currentValue',
      header: () => <div className="text-right">Current Value</div>,
      cell: function Cell({ row }) {
        const { formatCurrency } = useCurrency();
        const amount = parseFloat(String(row.getValue('currentValue')));
        return <div className="text-right font-medium">{formatCurrency(amount)}</div>
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <ActionsCell row={row} onAssetUpdate={onAssetUpdate} />,
    },
];
