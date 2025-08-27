
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, AlertTriangle, Link2Off, Shuffle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Contract } from '@/app/tenancy/contract/schema';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const continuityStatusConfig = {
    'OK': { label: 'OK', className: 'bg-green-500/20 text-green-700' },
    'Gap': { label: 'Gap', className: 'bg-yellow-500/20 text-yellow-700', icon: <Shuffle className="h-3 w-3" /> },
    'Overlap': { label: 'Overlap', className: 'bg-red-500/20 text-red-700', icon: <AlertTriangle className="h-3 w-3" /> },
    'Orphaned': { label: 'Orphaned', className: 'bg-purple-500/20 text-purple-700', icon: <Link2Off className="h-3 w-3" /> },
};


export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: 'contractNo',
    header: 'Contract No',
    cell: ({ row }) => (
      <Button asChild variant="link" className="p-0 h-auto">
          <Link href={`/tenancy/contract?id=${row.original.id}`}>{row.original.contractNo}</Link>
      </Button>
    )
  },
  {
    accessorKey: 'tenantName',
    header: 'Tenant',
  },
   {
    accessorKey: 'property',
    header: 'Property',
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Start Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(new Date(row.original.startDate), 'PP'),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => format(new Date(row.original.endDate), 'PP'),
  },
  {
    accessorKey: 'periodStatus',
    header: 'Continuity Issue',
    cell: ({ row }) => {
        const status = row.original.periodStatus;
        if (!status) return null;
        const config = continuityStatusConfig[status];
        return <Badge variant="outline" className={cn('gap-1 border-transparent', config.className)}>{config.icon}{config.label}</Badge>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
        <Button asChild size="sm" variant="outline">
            <Link href={`/tenancy/contract?id=${row.original.id}`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit to Fix
            </Link>
        </Button>
    )
  },
];
