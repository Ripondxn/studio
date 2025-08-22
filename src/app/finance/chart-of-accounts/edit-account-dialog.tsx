
'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema, Account } from './schema';
import { updateAccount } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';


const accountFormSchema = accountSchema.omit({ balance: true });
type AccountFormData = z.infer<typeof accountFormSchema>;


export function EditAccountDialog({ account, isOpen, setIsOpen, onSuccess }: { account: Account, isOpen: boolean, setIsOpen: (open: boolean) => void, onSuccess: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
  });
  
  useEffect(() => {
    if(isOpen) {
        reset(account);
    }
  }, [account, reset, isOpen]);


  const onSubmit = async (data: AccountFormData) => {
    setIsSaving(true);
    const result = await updateAccount(data);

    if (result.success) {
      toast({
        title: 'Account Updated',
        description: `Successfully updated account "${data.name}".`,
      });
      setIsOpen(false);
      onSuccess();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsSaving(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
        reset(); 
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
                Update the details for {account.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Account Code</Label>
              <Input id="code" {...register('code')} disabled />
              {errors.code && <p className="text-destructive text-xs mt-1">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="parentCode">Parent Account Code</Label>
              <Input id="parentCode" {...register('parentCode')} />
              {errors.parentCode && <p className="text-destructive text-xs mt-1">{errors.parentCode.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Asset">Asset</SelectItem>
                                <SelectItem value="Liability">Liability</SelectItem>
                                <SelectItem value="Equity">Equity</SelectItem>
                                <SelectItem value="Revenue">Revenue</SelectItem>
                                <SelectItem value="Expense">Expense</SelectItem>
                                <SelectItem value="Header">Header</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
             <div className="flex items-center space-x-2">
                <Controller
                    name="isGroup"
                    control={control}
                    render={({ field }) => (
                         <Switch
                            id="isGroup"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                         />
                    )}
                />
                <Label htmlFor="isGroup">Is Group Account?</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving || !isDirty}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
