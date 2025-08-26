
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Asset } from './schema';

export const columns = ({ onAssetUpdate }: { onAssetUpdate: () => void }): ColumnDef<Asset>[] => [
    {
      accessorKey: 'assetCode',
      header: 'Asset Code',
    },
    {
      accessorKey: 'assetName',
      header: 'Asset Name',
    },
    {
      accessorKey: 'assetType',
      header: 'Type',
    },
    {
      accessorKey: 'purchaseDate',
      header: 'Purchase Date',
    },
    {
      accessorKey: 'purchaseCost',
      header: 'Cost',
    },
    {
      accessorKey: 'currentValue',
      header: 'Current Value',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const asset = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(asset.id)}>
                Copy asset ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
];
