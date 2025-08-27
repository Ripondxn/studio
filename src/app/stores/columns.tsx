
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { type StockItem } from './schema';

export const columns: ColumnDef<StockItem>[] = [
  {
    accessorKey: 'itemCode',
    header: 'Item Code',
  },
  {
    accessorKey: 'itemName',
    header: 'Item Name',
  },
  {
    accessorKey: 'quantity',
    header: () => <div className="text-right">Quantity</div>,
    cell: ({ row }) => <div className="text-right font-medium">{row.original.quantity}</div>,
  },
];
