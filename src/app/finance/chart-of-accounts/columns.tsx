
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Folder, File, Pencil, Trash2, Eye } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Account } from './schema';
import { TransactionHistoryDialog } from './transaction-history-dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deleteAccount } from './actions';
import { useRouter } from 'next/navigation';
import { EditAccountDialog } from './edit-account-dialog';


const ActionsCell = ({ row }: { row: { original: Account }}) => {
    const account = row.original;
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteAccount(account.code);
        if (result.success) {
            toast({ title: "Success", description: "Account and its sub-accounts have been deleted." });
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.error });
        }
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    }
    
    return (
      <>
        <EditAccountDialog
          account={account}
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          onSuccess={() => router.refresh()}
        />
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the account "{account.name}" and any sub-accounts.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                    {isDeleting ? "Deleting..." : "Delete"}
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
                    <TransactionHistoryDialog account={account}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Eye className="mr-2 h-4 w-4" /> View Transactions
                        </DropdownMenuItem>
                    </TransactionHistoryDialog>
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </>
    )
}

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
    cell: ActionsCell,
  },
];
