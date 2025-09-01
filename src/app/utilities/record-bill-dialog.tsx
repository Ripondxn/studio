
'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { type UtilityAccount } from './schema';
import { recordBillPayment } from './actions';
import type { UserRole } from '@/app/admin/user-roles/schema';

const formSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be positive'),
  billDate: z.string().min(1, 'Bill date is required.'),
});

type FormData = z.infer<typeof formSchema>;

interface RecordBillDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  account: UtilityAccount;
  onSuccess: () => void;
}

export function RecordBillDialog({ isOpen, setIsOpen, account, onSuccess }: RecordBillDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserRole | null>(null);

  useEffect(() => {
    const userProfile = sessionStorage.getItem('userProfile');
    if(userProfile) setCurrentUser(JSON.parse(userProfile));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if(isOpen) {
        reset({ billDate: format(new Date(), 'yyyy-MM-dd') });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    if (!currentUser) {
        toast({variant: 'destructive', title: 'Error', description: 'Could not find current user.'});
        return;
    }
    setIsSaving(true);
    const result = await recordBillPayment(account.id, data.amount, data.billDate, currentUser);
    if(result.success) {
        toast({title: 'Payment Recorded', description: 'A payment voucher has been created.'});
        onSuccess();
        setIsOpen(false);
    } else {
        toast({variant: 'destructive', title: 'Error', description: result.error});
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>Record Bill Payment</DialogTitle>
                <DialogDescription>
                    Record a payment for {account.utilityType} - {account.accountNumber}. A payment voucher will be created.
                </DialogDescription>
            </DialogHeader>
             <div className="grid gap-4 py-4">
                 <div className="space-y-2">
                    <Label htmlFor="billDate">Bill / Payment Date</Label>
                    <Input id="billDate" type="date" {...register('billDate')} />
                    {errors.billDate && <p className="text-destructive text-xs mt-1">{errors.billDate.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" {...register('amount')} />
                    {errors.amount && <p className="text-destructive text-xs mt-1">{errors.amount.message}</p>}
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Record Payment
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
