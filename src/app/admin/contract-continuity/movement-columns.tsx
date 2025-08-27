
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MovementHistoryItem } from './actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const movementColumns: ColumnDef<MovementHistoryItem>[] = [
  {
    accessorKey: 'date',
    header: 'Movement Date',
    cell: ({ row }) => format(new Date(row.original.date), 'PP'),
  },
  {
    accessorKey: 'tenantName',
    header: 'Tenant',
    cell: ({row}) => (
        <div>
            <div>{row.original.tenantName}</div>
            <div className="text-xs text-muted-foreground">{row.original.tenantCode}</div>
        </div>
    )
  },
  {
    accessorKey: 'contractNo',
    header: 'Contract No',
    cell: ({row}) => (
        <Button asChild variant="link" className="p-0 h-auto">
            <Link href={`/tenancy/contract?contractNo=${row.original.contractNo}`}>
                {row.original.contractNo}
            </Link>
        </Button>
    )
  },
  {
    accessorKey: 'details',
    header: 'Movement Details',
  },
  {
    accessorKey: 'daysInPreviousLocation',
    header: () => <div className="text-right">Days in Previous Location</div>,
    cell: ({ row }) => <div className="text-right">{row.original.daysInPreviousLocation}</div>,
  },
];
