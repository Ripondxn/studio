
'use client';

import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema, Account } from './schema';
import { addAccount } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';


const accountFormSchema = accountSchema.extend({
  balance: z.number().optional(),
});

type AccountFormData = Zod.infer<typeof accountFormSchema>;


export function AddAccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      code: '',
      name: '',
      type: 'Asset',
      status: 'Active',
      isGroup: false,
      parentCode: '',
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    setIsSaving(true);
    const result = await addAccount(data);

    if (result.success) {
      toast({
        title: 'Account Added',
        description: `Successfully added new account "${data.name}".`,
      });
      setIsOpen(false);
      router.refresh();
      reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Fill in the details for the new account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Account Code</Label>
              <Input id="code" {...register('code')} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

