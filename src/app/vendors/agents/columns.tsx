

'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, MoreHorizontal, DollarSign } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Agent } from './schema';
import { EditAgentDialog } from './edit-agent-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const ActionsCell = ({ row, onRecordPayment }: { row: { original: Agent }, onRecordPayment: (agent: Agent) => void }) => {
  const agent = row.original;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
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
