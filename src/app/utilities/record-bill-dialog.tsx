
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
import { recordBillForAccount } from './actions';
import type { UserRole } from '@/app/admin/user-roles/schema';

const formSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be positive'),
  billDate: z.string().min(1, 'Bill date is required.'),
  dueDate: z.string().optional(),
  billNo: z.string().min(1, 'Bill number is required'),
  notes: z.string().optional(),
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
        reset({ billDate: format(new Date(), 'yyyy-MM-dd'), dueDate: format(new Date(), 'yyyy-MM-dd'), amount: 0, billNo: '', notes: '' });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    const result = await recordBillForAccount({ accountId: account.id, ...data });
    if(result.success) {
        toast({title: 'Bill Recorded', description: 'A new bill has been created and sent for approval.'});
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
                <DialogTitle>Record Utility Bill</DialogTitle>
                <DialogDescription>
                    Enter the details from the bill for {account.provider} - {account.accountNumber}.
                </DialogDescription>
            </DialogHeader>
             <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="billNo">Bill / Invoice Number</Label>
                    <Input id="billNo" {...register('billNo')} />
                    {errors.billNo && <p className="text-destructive text-xs mt-1">{errors.billNo.message}</p>}
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="billDate">Bill Date</Label>
                        <Input id="billDate" type="date" {...register('billDate')} />
                        {errors.billDate && <p className="text-destructive text-xs mt-1">{errors.billDate.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input id="dueDate" type="date" {...register('dueDate')} />
                    </div>
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
                    Record Bill
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
