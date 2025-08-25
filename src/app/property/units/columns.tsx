
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, FilePlus2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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

import { Unit } from './schema';
import { useToast } from '@/hooks/use-toast';
import { deleteUnit } from './actions';
import { EditUnitDialog } from './edit-unit-dialog';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useCurrency } from '@/context/currency-context';

const ActionsCell = ({ row }: { row: { original: Unit } }) => {
    const unit = row.original;
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const isAvailable = unit.occupancyStatus !== 'Occupied';

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteUnit(unit.id);
        if (result.success) {
            toast({
                title: 'Unit Deleted',
                description: `Unit "${unit.unitCode}" has been deleted.`,
            });
            router.refresh();
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
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
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete unit "{unit.unitCode}".
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
            <EditUnitDialog
                unit={unit}
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                onUnitUpdated={() => router.refresh()}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {isAvailable && (
                        <DropdownMenuItem asChild>
                            <Link href={`/tenancy/contract?propertyCode=${unit.propertyCode}&unitCode=${unit.unitCode}`}>
                                <FilePlus2 className="mr-2 h-4 w-4" />
                                Create Tenancy
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive"
                        onSelect={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};


export const columns: ColumnDef<Unit>[] = [
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
    accessorKey: 'unitCode',
     header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Unit Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'unitType',
    header: 'Unit Type',
  },
  {
    accessorKey: 'annualRent',
    header: () => <div className="text-right">Annual Rent</div>,
     cell: function Cell({ row }) {
      const { formatCurrency } = useCurrency();
      const amount = parseFloat(String(row.getValue('annualRent')));
      
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: 'occupancyStatus',
    header: 'Occupancy Status',
    cell: ({ row }) => {
      const status = row.getValue('occupancyStatus') as string;
      const statusConfig = {
        'Vacant': { variant: 'default', color: 'bg-green-500/20 text-green-700' },
        'Occupied': { variant: 'destructive', color: 'bg-red-500/20 text-red-700' },
        'Partially Occupied': { variant: 'secondary', color: 'bg-yellow-500/20 text-yellow-700' }
      };
      const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', color: '' };
      return <Badge variant={config.variant as any} className={cn(config.color, 'border-transparent')}>{status}</Badge>;
    },
  },
   {
    id: 'actions',
    cell: ActionsCell,
  },
];
