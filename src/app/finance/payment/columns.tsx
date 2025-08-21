
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, User, Building, Wrench } from 'lucide-react';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Payment } from './schema';
import { cn } from '@/lib/utils';

const partyTypeConfig: {
  [key in Payment['partyType']]: {
    icon: React.ReactNode;
  };
} = {
  'Tenant': { icon: <User className="h-3 w-3" /> },
  'Landlord': { icon: <Building className="h-3 w-3" /> },
  'Vendor': { icon: <Wrench className="h-3 w-3" /> },
  'Customer': { icon: <User className="h-3 w-3" /> },
};


export const columns: ColumnDef<Payment>[] = [
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
    cell: ({ row }) => {
        const type = row.original.type;
        const color = type === 'Receipt' ? 'text-green-600' : 'text-red-600';
        return <span className={cn('font-medium', color)}>{type}</span>
    }
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
     cell: ({ row }) => format(new Date(row.getValue('date')), 'PP'),
  },
  {
    accessorKey: 'partyName',
    header: 'Party',
    cell: ({ row }) => {
        const partyType = row.original.partyType;
        const config = partyTypeConfig[partyType];
        return (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.partyName}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">{config.icon}{partyType}</span>
            </div>
        )
    }
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
   {
    accessorKey: 'paymentMethod',
    header: 'Method',
  },
  {
    accessorKey: 'referenceNo',
    header: 'Reference',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Payment['status'];
      const variant = status === 'Cancelled' ? 'destructive' : 'secondary';
      const color = status === 'Received' ? 'bg-green-500/20 text-green-700' : status === 'Paid' ? 'bg-blue-500/20 text-blue-700' : '';
      return <Badge variant={variant} className={cn(color, 'border-transparent')}>{status}</Badge>;
    },
  },
];
