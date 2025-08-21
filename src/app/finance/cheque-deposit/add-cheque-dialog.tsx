
'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { chequeSchema, type Cheque } from './schema';
import { addCheque, getLookups } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type PaymentInstallment } from '@/app/tenancy/contract/schema';

type ChequeFormData = Omit<Cheque, 'id'>;
const chequeFormSchema = chequeSchema.omit({ id: true });

type ContractLookup = { 
    value: string, 
    label: string, 
    property?: string, 
    partyName?: string,
    paymentSchedule?: PaymentInstallment[],
};

type Lookups = {
    tenants: { value: string, label: string, contractNo?: string }[];
    landlords: { value: string, label: string }[];
    tenancyContracts: ContractLookup[];
    leaseContracts: ContractLookup[];
}

export function AddChequeDialog({ onChequeAdded }: { onChequeAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<Lookups>({ tenants: [], landlords: [], tenancyContracts: [], leaseContracts: [] });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChequeFormData>({
    resolver: zodResolver(chequeFormSchema),
    defaultValues: {
        chequeNo: '',
        chequeDate: '',
        amount: 0,
        bankName: '',
        status: 'In Hand',
        type: 'Incoming',
        partyName: '',
        property: '',
        contractNo: '',
        remarks: '',
    }
  });

  useEffect(() => {
      if(isOpen) {
        getLookups().then(setLookups);
        reset();
      }
  }, [isOpen, reset]);
  
  const chequeType = watch('type');

  const partyOptions = chequeType === 'Incoming' ? lookups.tenants : lookups.landlords;
  const contractOptions = chequeType === 'Incoming' ? lookups.tenancyContracts : lookups.leaseContracts;

  const handleContractSelect = (value: string) => {
    setValue('contractNo', value);
    const contract = contractOptions.find(c => c.value === value);
    if (contract) {
        if(contract.property) setValue('property', contract.property);
        if(contract.partyName) setValue('partyName', contract.partyName);
        
        // Find the next unpaid installment and populate the form
        const nextInstallment = contract.paymentSchedule?.find(p => p.status === 'unpaid');
        if (nextInstallment) {
            if(nextInstallment.chequeNo) setValue('chequeNo', nextInstallment.chequeNo);
            if(nextInstallment.dueDate) setValue('chequeDate', nextInstallment.dueDate);
            if(nextInstallment.amount) setValue('amount', nextInstallment.amount);
        }
    }
  }


  const onSubmit = async (data: ChequeFormData) => {
    setIsSaving(true);
    const result = await addCheque(data);

    if (result.success) {
      toast({
        title: 'Cheque Added',
        description: `Successfully added cheque #${data.chequeNo}.`,
      });
      setIsOpen(false);
      onChequeAdded();
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
          <Plus className="mr-2 h-4 w-4" /> Add Cheque
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Add New Cheque</DialogTitle>
            <DialogDescription>
                Fill in the details below to record a new cheque.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                
                <div className="space-y-2">
                    <Label>Cheque Type</Label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Incoming">Incoming (from Tenant)</SelectItem>
                                    <SelectItem value="Outgoing">Outgoing (to Landlord)</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="contractNo">Contract No</Label>
                        <Controller
                            name="contractNo"
                            control={control}
                            render={({ field }) => (
                                <Combobox
                                    options={contractOptions}
                                    value={field.value || ''}
                                    onSelect={handleContractSelect}
                                    placeholder="Select Contract"
                                />
                            )}
                        />
                         {errors.contractNo && <p className="text-destructive text-xs mt-1">{errors.contractNo.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="partyName">{chequeType === 'Incoming' ? 'Tenant' : 'Landlord'}</Label>
                        <Controller
                            name="partyName"
                            control={control}
                            render={({ field }) => (
                                <Combobox
                                    options={partyOptions}
                                    value={field.value}
                                    onSelect={(value) => setValue('partyName', value)}
                                    placeholder={`Select ${chequeType === 'Incoming' ? 'Tenant' : 'Landlord'}`}
                                />
                            )}
                        />
                         {errors.partyName && <p className="text-destructive text-xs mt-1">{errors.partyName.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="property">Property</Label>
                    <Input id="property" {...register('property')} placeholder="Associated property" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="chequeNo">Cheque No</Label>
                        <Input id="chequeNo" {...register('chequeNo')} />
                        {errors.chequeNo && <p className="text-destructive text-xs mt-1">{errors.chequeNo.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="chequeDate">Cheque Due Date</Label>
                        <Input id="chequeDate" type="date" {...register('chequeDate')} />
                        {errors.chequeDate && <p className="text-destructive text-xs mt-1">{errors.chequeDate.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" {...register('amount', { valueAsNumber: true })} />
                        {errors.amount && <p className="text-destructive text-xs mt-1">{errors.amount.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" {...register('bankName')} />
                        {errors.bankName && <p className="text-destructive text-xs mt-1">{errors.bankName.message}</p>}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Textarea id="remarks" {...register('remarks')} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Cheque
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
