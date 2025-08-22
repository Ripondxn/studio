
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Folder, File, Pencil, Trash2, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Account } from './schema';
import { TransactionHistoryDialog } from './transaction-history-dialog';


export const columns: ColumnDef<Account>[] = [
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
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const account = row.original;
      const isGroup = account.isGroup;
      const Icon = isGroup ? Folder : File;
      const indentLevel = (account.code.match(/00$/) ? 0 : (account.code.match(/0$/) ? 1 : 2));


      return (
        <div style={{ paddingLeft: `${indentLevel * 1.5}rem` }} className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className={isGroup ? 'font-bold' : ''}>{account.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
        const type = row.getValue('type') as string;
        let color: "default" | "secondary" | "destructive" | "outline" = "default";
        switch (type) {
            case 'Asset': color = 'default'; break;
            case 'Liability': color = 'destructive'; break;
            case 'Equity': color = 'secondary'; break;
            case 'Revenue': color = 'outline'; break;
            case 'Expense': color = 'secondary'; break;
            case 'Header': color = 'default'; break;
        }
        return <Badge variant={color} className="capitalize">{type}</Badge>;
    }
  },
  {
    accessorKey: 'balance',
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('balance'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium font-code">{formatted}</div>;
    },
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
    id: 'actions',
    cell: ({ row }) => {
      const account = row.original;
      if (account.isGroup) {
        return null; // No actions for group accounts
      }
      
      return (
        <div className="text-right">
            <TransactionHistoryDialog account={account}>
              <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
              </Button>
            </TransactionHistoryDialog>
        </div>
      );
    },
  },
];
