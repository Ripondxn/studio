
'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { transferFunds } from './actions';
import { type BankAccount } from './schema';
import { useCurrency } from '@/context/currency-context';

const fundTransferSchema = z.object({
    fromAccountId: z.string().min(1, 'From account is required.'),
    toAccountId: z.string().min(1, 'To account is required.'),
    amount: z.coerce.number().min(0.01, 'Amount must be positive'),
    date: z.string().min(1, 'Date is required'),
    remarks: z.string().optional(),
}).refine(data => data.fromAccountId !== data.toAccountId, {
    message: "From and To accounts cannot be the same.",
    path: ["toAccountId"],
});


type FundTransferFormData = z.infer<typeof fundTransferSchema>;

interface FundTransferDialogProps {
  children: React.ReactNode;
  bankAccounts: BankAccount[];
  onTransaction: () => void;
}

export function FundTransferDialog({ children, bankAccounts, onTransaction }: FundTransferDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FundTransferFormData>({
    resolver: zodResolver(fundTransferSchema),
    defaultValues: {
        fromAccountId: '',
        toAccountId: '',
        amount: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        remarks: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        fromAccountId: '',
        toAccountId: '',
        amount: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        remarks: ''
      });
    }
  }, [isOpen, reset, bankAccounts]);

  const onSubmit = async (data: FundTransferFormData) => {
    const result = await transferFunds(data);
    if(result.success) {
        toast({ title: "Success", description: "Funds transferred successfully." });
        onTransaction();
        setIsOpen(false);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to transfer funds.' });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Transfer Funds</DialogTitle>
            <DialogDescription>
              Move funds between your accounts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="fromAccountId">From Account</Label>
                    <Controller
                        name="fromAccountId"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select Source" /></SelectTrigger>
                                <SelectContent>
                                    {bankAccounts.map(account => (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.accountName} ({formatCurrency(account.balance)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.fromAccountId && <p className="text-destructive text-sm">{errors.fromAccountId.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="toAccountId">To Account</Label>
                    <Controller
                        name="toAccountId"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select Destination" /></SelectTrigger>
                                <SelectContent>
                                    {bankAccounts.map(account => (
                                        <SelectItem key={account.id} value={account.id}>{account.accountName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                     {errors.toAccountId && <p className="text-destructive text-sm">{errors.toAccountId.message}</p>}
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" {...register('amount')} />
                    {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" {...register('date')} />
                    {errors.date && <p className="text-destructive text-sm">{errors.date.message}</p>}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" {...register('remarks')} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
