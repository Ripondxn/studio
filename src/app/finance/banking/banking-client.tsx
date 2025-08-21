
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, Banknote, Landmark, Loader2, Wallet } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bankAccountSchema, type BankAccount } from './schema';
import { saveBankAccount, deleteBankAccount, getBankAccounts } from './actions';
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

const BankAccountCard = ({ account, onEdit, onDelete }: { account: BankAccount, onEdit: () => void, onDelete: (id: string) => void }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const isPettyCash = account.id === 'acc_3';

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                       {isPettyCash ? <Wallet className="h-6 w-6" /> : <Landmark className="h-6 w-6" />}
                    </div>
                    <div>
                        <CardTitle>{account.accountName}</CardTitle>
                        <CardDescription>{account.bankName} - {account.accountNumber}</CardDescription>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <BankAccountDialog account={account} onSave={onEdit}>
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
                                    <AlertDialogAction onClick={() => onDelete(account.id)} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}
                </p>
            </CardContent>
            <CardFooter>
                 <TransactionHistoryDialog account={account} />
            </CardFooter>
        </Card>
    );
};


export function BankingClient({ initialAccounts }: { initialAccounts: BankAccount[] }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const { toast } = useToast();

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);


  const refreshAccounts = async () => {
    const updatedAccounts = await getBankAccounts();
    setAccounts(updatedAccounts);
  }

  const handleDeleteAccount = async (id: string) => {
    const result = await deleteBankAccount(id);
    if(result.success) {
        toast({ title: 'Success', description: 'Bank account has been deleted.'});
        refreshAccounts();
    } else {
         toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to delete account.' });
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Banking</h1>
            <p className="text-muted-foreground">
                Manage bank accounts, reconciliations, and transactions.
            </p>
        </div>
        <BankAccountDialog onSave={refreshAccounts}>
            <Button><Plus className="mr-2 h-4 w-4"/>Add New Account</Button>
        </BankAccountDialog>
      </div>
      
       <div className="mb-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED' }).format(totalBalance)}
                 </div>
                 <p className="text-xs text-muted-foreground">Aggregated balance from all accounts.</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
            <BankAccountCard key={acc.id} account={acc} onEdit={refreshAccounts} onDelete={handleDeleteAccount} />
        ))}
      </div>
    </div>
  );
}
