'use client';

import {ColumnDef} from '@tanstack/react-table';
import {Contract} from '@/app/tenancy/contract/schema';
import {format} from 'date-fns';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Pencil} from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<Contract & {periodStatus?: string}>[] = [
  {
    accessorKey: 'contractNo',
    header: 'Contract No',
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
    accessorKey: 'unitCode',
    header: 'Unit',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({row}) => format(new Date(row.original.startDate), 'PP'),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({row}) => format(new Date(row.original.endDate), 'PP'),
  },
  {
    accessorKey: 'periodStatus',
    header: 'Issue Type',
    cell: ({row}) => {
      const status = row.original.periodStatus;
      if (status === 'Gap') {
        return <Badge variant="destructive" className="bg-yellow-500/80">Gap</Badge>;
      }
      if (status === 'Overlap') {
        return <Badge variant="destructive">Overlap</Badge>;
      }
      return <Badge variant="secondary">Unknown</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({row}) => (
      <Button asChild variant="outline" size="sm">
        <Link href={`/tenancy/contract?id=${row.original.id}`}>
          <Pencil className="mr-2 h-4 w-4" /> Edit to Fix
        </Link>
      </Button>
    ),
  },
];
