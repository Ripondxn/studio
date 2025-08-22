
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Banknote, Edit, Landmark, MoreVertical, Trash2, Wallet } from 'lucide-react';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { deleteBankAccount, saveBankAccount } from './actions';
import { BankAccount, bankAccountSchema } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { TransactionHistoryDialog } from './transaction-history-dialog';

type BankAccountFormData = Omit<BankAccount, 'id'> & { id?: string };

const BankAccountDialog = ({ account, onSave, children }: { account?: BankAccount, onSave: () => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<BankAccountFormData>({
        resolver: zodResolver(bankAccountSchema.omit({id: true})),
        defaultValues: account || {
            accountName: '',
            bankName: '',
            accountNumber: '',
            balance: 0,
            currency: 'AED'
        }
    });
    
    const handleSave = async (data: BankAccountFormData) => {
        const dataToSave = {
            ...data,
            id: account?.id || `acc_${Date.now()}`
        };
        
        const result = await saveBankAccount(dataToSave, !account);

        if (result.success) {
            toast({ title: 'Success', description: `Bank account "${data.accountName}" has been saved.` });
            onSave();
            setIsOpen(false);
            reset();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to save account.' });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                 <form onSubmit={handleSubmit(handleSave)}>
                    <DialogHeader>
                        <DialogTitle>{account ? 'Edit Bank Account' : 'Add New Bank Account'}</DialogTitle>
                        <DialogDescription>
                            Fill in the details for your bank account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="accountName">Account Nickname</Label>
                            <Input id="accountName" {...register('accountName')} />
                            {errors.accountName && <p className="text-destructive text-sm">{errors.accountName.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input id="bankName" {...register('bankName')} />
                            {errors.bankName && <p className="text-destructive text-sm">{errors.bankName.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input id="accountNumber" {...register('accountNumber')} />
                            {errors.accountNumber && <p className="text-destructive text-sm">{errors.accountNumber.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="balance">Current Balance</Label>
                            <Input id="balance" type="number" {...register('balance', { valueAsNumber: true })} />
                             {errors.balance && <p className="text-destructive text-sm">{errors.balance.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Account
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


const ActionsCell = ({ row, onAccountUpdate }: { row: { original: BankAccount }, onAccountUpdate: () => void }) => {
    const account = row.original;
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const isPettyCash = account.id === 'acc_3';

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteBankAccount(account.id);
        if(result.success) {
            toast({ title: 'Success', description: 'Bank account has been deleted.'});
            onAccountUpdate();
        } else {
             toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to delete account.' });
        }
        setIsDeleting(false);
    }
    
    return (
      <div className="text-right">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                 <TransactionHistoryDialog account={account}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <History className="mr-2 h-4 w-4"/> View Transactions
                    </DropdownMenuItem>
                </TransactionHistoryDialog>
                <BankAccountDialog account={account} onSave={onAccountUpdate}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={isPettyCash}>
                        <Edit className="mr-2 h-4 w-4"/> Edit
                    </DropdownMenuItem>
                </BankAccountDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()} disabled={isPettyCash}>
                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the "{account.accountName}" account.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
};

export const columns = ({ onAccountUpdate }: { onAccountUpdate: () => void }): ColumnDef<BankAccount>[] => [
  {
    accessorKey: 'accountName',
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Account Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({row}) => {
        const isPettyCash = row.original.id === 'acc_3';
        return (
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {isPettyCash ? <Wallet className="h-4 w-4" /> : <Landmark className="h-4 w-4" />}
                </div>
                <span className="font-medium">{row.original.accountName}</span>
            </div>
        )
    }
  },
  {
    accessorKey: 'bankName',
    header: 'Bank',
  },
  {
    accessorKey: 'accountNumber',
    header: 'Account Number',
  },
  {
    accessorKey: 'balance',
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('balance'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'AED',
      }).format(amount);

      return <div className="text-right font-medium font-mono">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onAccountUpdate={onAccountUpdate} />,
  },
];
