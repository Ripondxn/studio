
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { type ReceiptLeaf } from './schema';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useCurrency } from '@/context/currency-context';

export const columns: ColumnDef<ReceiptLeaf>[] = [
  {
    accessorKey: 'receiptNo',
    header: 'Receipt No',
  },
  {
    accessorKey: 'bookNo',
    header: 'Book No',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.original.status;
        const variant = status === 'Used' ? 'default' : 'secondary';
        const color = status === 'Used' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
        return <Badge variant={variant} className={`${color} border-transparent`}>{status}</Badge>
    }
  },
  {
    accessorKey: 'date',
    header: 'Date Used',
    cell: ({ row }) => row.original.date ? format(new Date(row.original.date), 'PP') : <span className="text-muted-foreground">N/A</span>,
  },
  {
    accessorKey: 'partyName',
    header: 'Party Name',
    cell: ({ row }) => row.original.partyName || <span className="text-muted-foreground">N/A</span>,
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: function Cell({ row }) {
        const { formatCurrency } = useCurrency();
        return row.original.amount ? <div className="text-right font-medium">{formatCurrency(row.original.amount)}</div> : <span className="text-muted-foreground text-right block">N/A</span>;
    },
  },
  {
    accessorKey: 'collectedBy',
    header: 'Collector',
    cell: ({ row }) => row.original.collectedBy || <span className="text-muted-foreground">N/A</span>,
  },
];
