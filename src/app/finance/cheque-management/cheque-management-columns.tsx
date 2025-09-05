
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type Cheque } from './schema';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<Cheque>[] = [
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
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'party',
    header: 'Party',
  },
  {
    accessorKey: 'bankName',
    header: 'Bank Name',
  },
  {
    accessorKey: 'chequeNo',
    header: 'Cheque No',
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];
