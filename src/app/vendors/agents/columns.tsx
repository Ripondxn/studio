

'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, MoreHorizontal, DollarSign, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Agent } from './schema';
import { EditAgentDialog } from './edit-agent-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
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
import { deleteAgent } from '../actions';
import { useRouter } from 'next/navigation';


const ActionsCell = ({ row, onRecordPayment }: { row: { original: Agent }, onRecordPayment: (agent: Agent) => void }) => {
  const agent = row.original;
  const { toast } = useToast();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAgent(agent.code);
    if(result.success) {
        toast({title: "Agent Deleted", description: `Agent ${agent.name} has been removed.`});
        router.refresh();
    } else {
        toast({variant: 'destructive', title: "Error", description: result.error || 'Failed to delete agent.'});
    }
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  }

  return (
    <>
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently remove agent "{agent.name}".
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

      <EditAgentDialog 
        agent={agent}
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
            <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Agent
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onRecordPayment(agent)} disabled={!agent.commission || agent.commission <= 0}>
                <DollarSign className="mr-2 h-4 w-4" />
                Record Payment
            </DropdownMenuItem>
             <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onSelect={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};


export const columns = (onRecordPayment: (agent: Agent) => void): ColumnDef<Agent>[] => [
  {
    accessorKey: 'code',
    header: 'Agent Code',
    cell: ({ row }) => {
        const agent = row.original;
        return (
             <Button variant="link" asChild className="p-0 h-auto font-normal">
                <Link href={`/vendors/add?code=${agent.vendorCode}`}>{agent.code}</Link>
            </Button>
        )
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Agent Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'mobile',
    header: 'Mobile',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'vendorName',
    header: 'Associated Vendor',
    cell: ({ row }) => {
        const agent = row.original;
        return (
            <Button variant="link" asChild className="p-0 h-auto font-normal">
                <Link href={`/vendors/add?code=${agent.vendorCode}`}>{agent.vendorName}</Link>
            </Button>
        )
    }
  },
  {
    accessorKey: 'commission',
    header: () => <div className="text-right">Commission</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('commission') || '0');
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{amount > 0 ? formatted : 'N/A'}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onRecordPayment={onRecordPayment} />,
  },
];
