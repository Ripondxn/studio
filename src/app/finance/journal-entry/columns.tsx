
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JournalEntry } from './schema';

interface ColumnsProps {
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<JournalEntry>[] => [
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'accountName', header: 'Account' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'debit', header: 'Debit', cell: ({ row }) => `$${row.original.debit.toFixed(2)}` },
  { accessorKey: 'credit', header: 'Credit', cell: ({ row }) => `$${row.original.credit.toFixed(2)}` },
  {
    id: 'actions',
    cell: ({ row }) => {
      const entry = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(entry)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(entry.id!)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
