
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash2, MoreHorizontal, FilePlus2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
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
import { deleteRoom } from './actions';
import { EditRoomDialog } from './edit-room-dialog';
import { Room } from './schema';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const ActionsCell = ({ row }: { row: { original: Room } }) => {
    const room = row.original;
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const isVacant = room.occupancyStatus === 'Vacant';

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteRoom(room.id);
        if (result.success) {
            toast({
                title: 'Room Deleted',
                description: `Room "${room.roomName}" has been deleted.`,
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
                            This action cannot be undone. This will permanently delete the room "{room.roomName}".
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
            
            <EditRoomDialog 
              room={room} 
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
                        {isVacant && (
                             <DropdownMenuItem asChild>
                               <Link href={`/tenancy/contract?propertyCode=${room.propertyCode}&unitCode=${room.unitCode}&roomCode=${room.roomCode}`}>
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


export const columns: ColumnDef<Room>[] = [
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
    accessorKey: 'roomCode',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Room Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'roomName',
    header: 'Room Name',
  },
  {
    accessorKey: 'unitCode',
    header: 'Unit Code',
  },
  {
    accessorKey: 'roomType',
    header: 'Room Type',
  },
  {
    accessorKey: 'rentAmount',
    header: () => <div className="text-right">Rent</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('rentAmount') || '0');
      const frequency = row.original.rentFrequency;
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted} <span className="text-xs text-muted-foreground">{frequency ? `/${frequency.slice(0,2)}` : ''}</span></div>;
    },
  },
  {
    accessorKey: 'occupancyStatus',
    header: 'Occupancy Status',
    cell: ({ row }) => {
      const status = row.original.occupancyStatus;
      const variant = status === 'Occupied' ? 'destructive' : 'default';
      return <Badge variant={variant} className={cn(status === 'Vacant' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700', 'border-transparent')}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
