
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, Banknote, Landmark, Loader2, Wallet, ArrowRightLeft, Briefcase, History, RefreshCw } from 'lucide-react';
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
import { AllTransactionsDialog } from './all-transactions-dialog';
import { EquityDialog } from '../equity/equity-dialog';
import { FundTransferDialog } from './fund-transfer-dialog';
import { DataTable } from './data-table';
import { columns } from './columns';
import { cn } from '@/lib/utils';

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

export function BankingClient({ initialAccounts }: { initialAccounts: BankAccount[] }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);


  const refreshAccounts = async () => {
    setIsLoading(true);
    try {
        const updatedAccounts = await getBankAccounts();
        setAccounts(updatedAccounts);
    } catch (e) {
        toast({variant: 'destructive', title: 'Error', description: 'Failed to refresh accounts.'});
    } finally {
        setIsLoading(false);
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
        <div className="flex items-center gap-2">
            <AllTransactionsDialog>
              <Button variant="outline"><History className="mr-2 h-4 w-4"/> + History</Button>
            </AllTransactionsDialog>
            <FundTransferDialog bankAccounts={accounts} onTransaction={refreshAccounts}>
                <Button variant="outline"><ArrowRightLeft className="mr-2 h-4 w-4"/> Fund Transfer</Button>
            </FundTransferDialog>
            <EquityDialog bankAccounts={accounts} onTransaction={refreshAccounts}>
                <Button variant="outline"><Briefcase className="mr-2 h-4 w-4"/> Equity</Button>
            </EquityDialog>
            <BankAccountDialog onSave={refreshAccounts}>
                <Button><Plus className="mr-2 h-4 w-4"/>Add New Account</Button>
            </BankAccountDialog>
            <Button variant="outline" size="icon" onClick={refreshAccounts} disabled={isLoading}>
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
        </div>
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

      <DataTable columns={columns({ onAccountUpdate: refreshAccounts })} data={accounts} />
    </div>
  );
}
