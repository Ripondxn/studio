
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { recordEquityTransaction } from './actions';
import { type BankAccount } from '../banking/schema';

const equitySchema = z.object({
    type: z.enum(['Contribution', 'Withdrawal']),
    amount: z.coerce.number().min(0.01, 'Amount must be positive'),
    date: z.string().min(1, 'Date is required'),
    accountId: z.string().min(1, 'Account is required'),
    remarks: z.string().optional(),
});

type EquityFormData = z.infer<typeof equitySchema>;

interface EquityDialogProps {
  children: React.ReactNode;
  bankAccounts: BankAccount[];
  onTransaction: () => void;
}

export function EquityDialog({ children, bankAccounts, onTransaction }: EquityDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EquityFormData>({
    resolver: zodResolver(equitySchema),
    defaultValues: {
        type: 'Contribution',
        amount: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        accountId: '',
        remarks: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        type: 'Contribution',
        amount: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        accountId: bankAccounts.length > 0 ? bankAccounts[0].id : '',
        remarks: ''
      });
    }
  }, [isOpen, reset, bankAccounts]);

  const onSubmit = async (data: EquityFormData) => {
    const result = await recordEquityTransaction(data);
    if(result.success) {
        toast({ title: "Success", description: "Equity transaction recorded successfully." });
        onTransaction();
        setIsOpen(false);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to record transaction.' });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Record Equity Transaction</DialogTitle>
            <DialogDescription>
              Record an owner's capital contribution or withdrawal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Contribution" id="contribution" />
                                <Label htmlFor="contribution">Contribution (Owner Adds Funds)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Withdrawal" id="withdrawal" />
                                <Label htmlFor="withdrawal">Withdrawal (Owner Takes Funds)</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
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
                <Label htmlFor="accountId">Account</Label>
                 <Controller
                    name="accountId"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an account" />
                            </SelectTrigger>
                            <SelectContent>
                                {bankAccounts.map(account => (
                                    <SelectItem key={account.id} value={account.id}>{account.accountName} ({account.bankName})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                 {errors.accountId && <p className="text-destructive text-sm">{errors.accountId.message}</p>}
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
                Record Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
