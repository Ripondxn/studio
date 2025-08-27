
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteMaintenanceContract } from './actions';
import { MaintenanceContract } from './schema';
import { useCurrency } from '@/context/currency-context';

const ActionsCell = ({ row }: { row: { original: MaintenanceContract } }) => {
  const contract = row.original;
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMaintenanceContract(contract.id);
      if (result.success) {
        toast({
          title: 'Success',
          description: `Contract "${contract.contractNo}" deleted successfully.`,
        });
        router.refresh();
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to delete contract.',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contract "{contract.contractNo}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/maintenance/contracts/add?id=${contract.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
  Active: 'default',
  Expired: 'secondary',
  Cancelled: 'destructive',
};

export const columns: ColumnDef<MaintenanceContract>[] = [
  {
    accessorKey: 'contractNo',
    header: 'Contract No',
    cell: ({ row }) => {
        const contract = row.original;
        return (
            <Button asChild variant="link" className="p-0 h-auto font-normal">
                <Link href={`/maintenance/contracts/add?id=${contract.id}`}>{contract.contractNo}</Link>
            </Button>
        )
    }
  },
  {
    accessorKey: 'serviceType',
    header: 'Service Type',
  },
  {
    accessorKey: 'vendorCode',
    header: 'Vendor',
  },
  {
    accessorKey: 'propertyCode',
    header: 'Property',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => format(new Date(row.getValue('startDate')), 'PP'),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
     cell: ({ row }) => format(new Date(row.getValue('endDate')), 'PP'),
  },
  {
    accessorKey: 'totalValue',
    header: () => <div className="text-right">Contract Value</div>,
    cell: function Cell({ row }) {
      const { formatCurrency } = useCurrency();
      const amount = parseFloat(row.getValue('totalValue'));
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant={statusVariantMap[status] || 'default'} className="capitalize">{status}</Badge>;
    }
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
