
'use client';

import { useState, useEffect } from 'react';
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
import { z } from 'zod';
import { utilityAccountSchema, type UtilityAccount } from './schema';
import { saveUtilityAccount } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLookups as getGeneralLookups } from '@/app/lookups/actions';
import { getUnitsForProperty } from '@/app/tenancy/contract/actions';
import { Combobox } from '@/components/ui/combobox';
import { type Unit } from '@/app/property/units/schema';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { UserRole } from '@/app/admin/user-roles/schema';

const formSchema = utilityAccountSchema.omit({ id: true, totalPaid: true }).extend({
    recordFirstBill: z.boolean().optional(),
    billAmount: z.coerce.number().optional(),
    billDate: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddUtilityAccountDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  account?: UtilityAccount;
  onSuccess: () => void;
  propertyCode?: string;
  currentUser: UserRole | null;
}

export function AddUtilityAccountDialog({ isOpen, setIsOpen, account, onSuccess, propertyCode, currentUser }: AddUtilityAccountDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<{properties: {value: string, label: string}[], units: Unit[]}>({properties: [], units: []});

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recordFirstBill: false,
    }
  });

  const watchedPropertyCode = watch('propertyCode', propertyCode);
  const recordFirstBill = watch('recordFirstBill');

  useEffect(() => {
    async function fetchLookups() {
        if(isOpen) {
            const data = await getGeneralLookups();
            setLookups(prev => ({...prev, properties: data.properties || []}));
            
            if(propertyCode) {
                 const unitsResult = await getUnitsForProperty(propertyCode);
                 setLookups(prev => ({...prev, units: unitsResult as Unit[] || []}));
            }
        }
    }
    fetchLookups();
  }, [isOpen, propertyCode]);
  
  useEffect(() => {
    async function fetchUnits() {
        if (watchedPropertyCode) {
             const unitsResult = await getUnitsForProperty(watchedPropertyCode);
             setLookups(prev => ({...prev, units: unitsResult as Unit[] || []}));
        }
    }
    if (watchedPropertyCode && watchedPropertyCode !== propertyCode) {
      fetchUnits();
    }
  }, [watchedPropertyCode, propertyCode]);

  useEffect(() => {
    if (isOpen) {
        reset(account ? { ...account, recordFirstBill: false } : {
            utilityType: 'Water & Electricity',
            provider: '',
            accountNumber: '',
            propertyCode: propertyCode || '',
            unitCode: '',
            status: 'Active',
            notes: '',
            recordFirstBill: false,
            billAmount: 0,
            billDate: '',
        });
    }
  }, [isOpen, account, reset, propertyCode]);

  const onSubmit = async (data: FormData) => {
    if (!currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'User not found. Please log in again.' });
      return;
    }
    setIsSaving(true);
    const result = await saveUtilityAccount({ ...data, id: account?.id }, currentUser);
    if (result.success) {
      toast({
        title: account ? 'Account Updated' : 'Account Added',
        description: `Utility account has been saved successfully.`,
      });
      onSuccess();
      setIsOpen(false);
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
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>{account ? 'Edit Utility Account' : 'Add New Utility Account'}</DialogTitle>
            <DialogDescription>
                Fill in the details for the new utility account.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label>Utility Type</Label>
                    <Controller name="utilityType" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
                            <SelectItem value="Water & Electricity">Water & Electricity</SelectItem>
                            <SelectItem value="Internet">Internet</SelectItem>
                            <SelectItem value="Telephone">Telephone</SelectItem>
                        </SelectContent></Select>
                    )} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Input id="provider" {...register('provider')} placeholder="e.g., DEWA, Etisalat" />
                    {errors.provider && <p className="text-destructive text-xs mt-1">{errors.provider.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" {...register('accountNumber')} />
                     {errors.accountNumber && <p className="text-destructive text-xs mt-1">{errors.accountNumber.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Property</Label>
                        <Controller name="propertyCode" control={control} render={({ field }) => (
                            <Combobox options={lookups.properties} value={field.value || ''} onSelect={field.onChange} placeholder="Select Property" disabled={!!propertyCode} />
                        )} />
                        {errors.propertyCode && <p className="text-destructive text-xs mt-1">{errors.propertyCode.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label>Unit (Optional)</Label>
                         <Controller name="unitCode" control={control} render={({ field }) => (
                            <Combobox options={lookups.units.map(u => ({value: u.unitCode, label: u.unitCode}))} value={field.value || ''} onSelect={field.onChange} placeholder="Select Unit" disabled={!watchedPropertyCode}/>
                        )} />
                    </div>
                </div>
                 {!account && (
                    <>
                        <Separator className="my-2" />
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="recordFirstBill"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            id="recordFirstBill"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <Label htmlFor="recordFirstBill">Record first bill for this account?</Label>
                            </div>
                            {recordFirstBill && (
                                <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                                    <div className="space-y-2">
                                        <Label htmlFor="billAmount">Bill Amount</Label>
                                        <Input id="billAmount" type="number" {...register('billAmount')} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="billDate">Bill Date</Label>
                                        <Input id="billDate" type="date" {...register('billDate')} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
                 <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea {...register('notes')} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {account ? 'Save Changes' : 'Add Account'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
