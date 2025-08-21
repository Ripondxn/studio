
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Unit } from '../schema';

export const columns: ColumnDef<Unit>[] = [
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
    accessorKey: 'unitCode',
     header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Unit Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
   {
    accessorKey: 'propertyCode',
    header: 'Property Code',
  },
  {
    accessorKey: 'floor',
    header: 'Floor',
  },
  {
    accessorKey: 'unitType',
    header: 'Unit Type',
  },
  {
    accessorKey: 'annualRent',
    header: () => <div className="text-right">Annual Rent</div>,
     cell: ({ row }) => {
      const amount = parseFloat(row.getValue('annualRent'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'unitStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('unitStatus') as string;
      return <Badge variant={'outline'} className='text-green-600 border-green-600'>Vacant</Badge>;
    },
  },
   {
    id: 'actions',
    cell: ({ row }) => {
        const unit = row.original;
        return (
            <Button asChild variant="outline" size="sm">
                <Link href={`/tenancy/contract?propertyCode=${unit.propertyCode}&unitCode=${unit.unitCode}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Create Lease
                </Link>
            </Button>
        )
    },
  },
];
