
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, MoreHorizontal, DollarSign, Trash2, History } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Agent } from './schema';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
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
import { deleteAgent } from './actions';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TransactionHistoryDialog } from './transaction-history-dialog';
import { useCurrency } from '@/context/currency-context';


const ActionsCell = ({ row, onRecordPayment }: { row: { original: Agent }, onRecordPayment: (agent: Agent) => void }) => {
  const agent = row.original;
  const { toast } = useToast();
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
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
      
      <TransactionHistoryDialog 
        agent={agent}
        isOpen={isHistoryOpen}
        setIsOpen={setIsHistoryOpen}
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
            <DropdownMenuItem asChild>
                <Link href={`/vendors/agents/add?code=${agent.code}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsHistoryOpen(true)}>
                <History className="mr-2 h-4 w-4" />
                View History
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onRecordPayment(agent)}>
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
                <Link href={`/vendors/agents/add?code=${agent.code}`}>{agent.code}</Link>
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
    accessorKey: 'vendorCode',
    header: 'Vendor Code',
    cell: ({ row }) => {
      const agent = row.original;
      return agent.vendorCode ? (
        <Button asChild variant="link" className="p-0 h-auto font-normal">
          <Link href={`/vendors/add?code=${agent.vendorCode}`}>{agent.vendorCode}</Link>
        </Button>
      ) : <span className="text-muted-foreground">N/A</span>
    }
  },
  {
    accessorKey: 'vendorName',
    header: 'Associated Vendor',
    cell: ({ row }) => {
        const agent = row.original;
        return agent.vendorCode ? (
            <Button variant="link" asChild className="p-0 h-auto font-normal">
                <Link href={`/vendors/add?code=${agent.vendorCode}`}>{agent.vendorName}</Link>
            </Button>
        ) : <span className="text-muted-foreground">N/A</span>
    }
  },
  {
    accessorKey: 'commissionRate',
    header: () => <div className="text-right">Commission</div>,
    cell: function Cell({ row }) {
      const { formatCurrency } = useCurrency();
      const agent = row.original;
      const commissionRate = agent.commissionRate || 0;
      const totalPaid = agent.totalCommissionPaid || 0;

      let status: 'Paid' | 'Unpaid' | 'N/A' = 'N/A';
      let badgeClass = '';

      if (commissionRate > 0) {
        if (totalPaid >= commissionRate) {
            status = 'Paid';
            badgeClass = 'bg-green-100 text-green-800';
        } else {
            status = 'Unpaid';
            badgeClass = 'bg-red-100 text-red-800';
        }
      }

      return (
        <div className="text-right font-medium flex flex-col items-end">
            <span>
                {formatCurrency(totalPaid)} / {formatCurrency(commissionRate)}
            </span>
            {status !== 'N/A' && <Badge variant="secondary" className={cn("mt-1", badgeClass)}>{status}</Badge>}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onRecordPayment={onRecordPayment} />,
  },
];
