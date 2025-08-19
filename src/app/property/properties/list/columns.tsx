
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { Property } from './schema';

export const columns: ColumnDef<Property>[] = [
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
    accessorKey: 'code',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'propertyType',
    header: 'Property Type',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = status === 'Active' ? 'default' : 'secondary';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'noOfUnits',
    header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              No of Units
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('noOfUnits'));
      return <div className="text-right font-medium">{amount}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const property = row.original;

      return (
        <div className="text-right">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/property/properties?code=${property.code}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

    