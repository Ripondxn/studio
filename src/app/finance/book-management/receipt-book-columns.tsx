
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { deleteReceiptBook } from './actions';
import { type ReceiptBook } from './schema';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const columns = ({ onEdit }: { onEdit: (book: ReceiptBook) => void }): ColumnDef<ReceiptBook>[] => {
  const ActionsCell = ({ row }: { row: { original: ReceiptBook } }) => {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteReceiptBook(row.original.id);
        if (result.success) {
            toast({ title: 'Success', description: 'Receipt book deleted successfully.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    };

    return (
        <>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the receipt book "{row.original.bookNo}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                    {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(row.original)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onSelect={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
  };
  
  return [
    {
      accessorKey: 'bookNo',
      header: 'Book No.',
    },
    {
        id: 'receiptRange',
        header: 'Receipt No. Range',
        cell: ({row}) => `${row.original.receiptStartNo} - ${row.original.receiptEndNo}`
    },
    {
        accessorKey: 'noOfLeafs',
        header: 'Total Leafs'
    },
    {
        id: 'usage',
        header: 'Usage',
        cell: ({row}) => {
            const used = row.original.leafsUsed || 0;
            const total = row.original.noOfLeafs || 1;
            const percentage = (used / total) * 100;
            return (
                <div className="flex flex-col gap-2">
                    <Progress value={percentage} className="h-2" />
                    <span className="text-xs text-muted-foreground">{used} of {total} used</span>
                </div>
            )
        }
    },
     {
        accessorKey: 'assignedTo',
        header: 'Assigned To',
        cell: ({row}) => row.original.assignedTo || <span className="text-muted-foreground">Unassigned</span>
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({row}) => <Badge variant={row.original.status === 'Active' ? 'default' : 'secondary'}>{row.original.status}</Badge>
    },
    {
      id: 'actions',
      cell: ActionsCell,
    },
  ];
};
