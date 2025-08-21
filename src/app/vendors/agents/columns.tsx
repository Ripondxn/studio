

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Agent } from './schema';

export const columns: ColumnDef<Agent>[] = [
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
];
