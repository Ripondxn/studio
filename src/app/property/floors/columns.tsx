
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import { deleteFloor } from './actions';
import { EditFloorDialog } from './edit-floor-dialog';
import { Floor } from './schema';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ActionsCell = ({ row }: { row: { original: Floor } }) => {
    const floor = row.original;
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteFloor(floor.id);
        if (result.success) {
            toast({
                title: 'Floor Deleted',
                description: `Floor "${floor.floorName}" has been deleted.`,
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
                            This action cannot be undone. This will permanently delete the floor "{floor.floorName}".
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
            
            <EditFloorDialog 
              floor={floor} 
              isOpen={isEditDialogOpen} 
              setIsOpen={setIsEditDialogOpen}
            />

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
                        <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
};


export const columns: ColumnDef<Floor>[] = [
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
    accessorKey: 'floorCode',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Floor Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'floorName',
    header: 'Floor Name',
  },
  {
    accessorKey: 'propertyCode',
    header: 'Property Code',
  },
  {
    accessorKey: 'noOfUnits',
    header: () => <div className="text-right">No. of Units</div>,
    cell: ({ row }) => {
      const amount = row.getValue('noOfUnits') as number;
      return <div className="text-right font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: 'occupancyStatus',
    header: 'Occupancy Status',
    cell: ({ row }) => {
      const status = row.original.occupancyStatus;
      const variant = status === 'Vacant' ? 'default' : status === 'Partially Occupied' ? 'secondary' : 'destructive';
      const color = status === 'Vacant' ? 'bg-green-500/20 text-green-700' : status === 'Partially Occupied' ? 'bg-yellow-500/20 text-yellow-700' : 'bg-red-500/20 text-red-700';
      
      return <Badge variant={variant} className={cn(color, 'border-transparent')}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
