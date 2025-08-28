
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { type ReceiptVoucher } from './schema';
import { useCurrency } from '@/context/currency-context';

export const columns: ColumnDef<ReceiptVoucher>[] = [
  {
    accessorKey: 'receiptNo',
    header: 'Receipt No',
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(new Date(row.original.date), 'PP'),
  },
  {
    accessorKey: 'partyName',
    header: 'Received From',
  },
   {
    accessorKey: 'collectedBy',
    header: 'Collected By',
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Method',
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: function Cell({ row }) {
        const { formatCurrency } = useCurrency();
        return <div className="text-right font-medium">{formatCurrency(row.original.amount)}</div>;
    },
  },
];
