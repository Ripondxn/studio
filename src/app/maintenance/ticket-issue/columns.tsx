
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash2, MoreHorizontal, Check, Clock, XCircle, Wrench, CircleHelp } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
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
import { deleteTicket } from './actions';
import { EditTicketDialog } from './edit-ticket-dialog';
import { MaintenanceTicket } from './schema';
import { cn } from '@/lib/utils';


const priorityVariantMap: { [key in MaintenanceTicket['priority']]: { variant: "default" | "secondary" | "destructive" | "outline", className?: string } } = {
    'Low': { variant: 'secondary' },
    'Medium': { variant: 'default', className: 'bg-yellow-500/20 text-yellow-700 border-transparent hover:bg-yellow-500/30' },
    'High': { variant: 'default', className: 'bg-orange-500/20 text-orange-700 border-transparent hover:bg-orange-500/30' },
    'Urgent': { variant: 'destructive' }
};

const statusVariantMap: { [key in MaintenanceTicket['status']]: { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ReactNode, className?: string } } = {
    'Open': { variant: 'default', icon: <CircleHelp className="h-3 w-3" />, className: 'bg-blue-500/20 text-blue-700 border-transparent hover:bg-blue-500/30' },
    'In Progress': { variant: 'default', icon: <Wrench className="h-3 w-3" />, className: 'bg-yellow-500/20 text-yellow-700 border-transparent hover:bg-yellow-500/30' },
    'On Hold': { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
    'Completed': { variant: 'outline', icon: <Check className="h-3 w-3" />, className: 'bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30' },
    'Cancelled': { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> }
};


const ActionsCell = ({ row }: { row: { original: MaintenanceTicket } }) => {
    const ticket = row.original;
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteTicket(ticket.id);
        if (result.success) {
            toast({
                title: 'Ticket Deleted',
                description: `Ticket "${ticket.ticketNo}" has been deleted.`,
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
                            This action cannot be undone. This will permanently delete ticket "{ticket.ticketNo}".
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
            
            <EditTicketDialog 
              ticket={ticket} 
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
                            Edit / View Details
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


export const columns: ColumnDef<MaintenanceTicket>[] = [
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
    accessorKey: 'ticketNo',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Ticket No
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'requestDate',
    header: 'Request Date',
    cell: ({ row }) => format(new Date(row.getValue('requestDate')), 'PP'),
  },
  {
    accessorKey: 'propertyCode',
    header: 'Property',
  },
  {
    accessorKey: 'unitCode',
    header: 'Unit',
  },
  {
    accessorKey: 'issueType',
    header: 'Issue Type',
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
        const priority = row.getValue('priority') as MaintenanceTicket['priority'];
        const config = priorityVariantMap[priority];
        return <Badge variant={config.variant} className={config.className}>{priority}</Badge>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as MaintenanceTicket['status'];
      const config = statusVariantMap[status];
      return <Badge variant={config.variant} className={cn('gap-1', config.className)}>{config.icon}{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
