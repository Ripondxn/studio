
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
import { paymentSchema, type Payment } from './schema';
import { addPayment, getLookups } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { updateInvoiceStatus } from '@/app/tenancy/customer/invoice/actions';


type PaymentFormData = Omit<Payment, 'id'>;
const paymentFormSchema = paymentSchema.omit({ id: true });

type Lookups = {
    tenants: { value: string, label: string }[];
    landlords: { value: string, label: string }[];
    vendors: { value: string, label: string }[];
    customers: { value: string, label: string }[];
    bankAccounts: { value: string, label: string }[];
}

interface AddPaymentDialogProps {
  onPaymentAdded: () => void;
  children?: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  defaultValues?: Partial<PaymentFormData>;
  associatedInvoiceId?: string | null;
}


export function AddPaymentDialog({ onPaymentAdded, children, isOpen: externalOpen, setIsOpen: setExternalOpen, defaultValues, associatedInvoiceId }: AddPaymentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen ?? internalOpen;
  const setIsOpen = setExternalOpen ?? setInternalOpen;
  
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<Lookups>({ tenants: [], landlords: [], vendors: [], customers: [], bankAccounts: [] });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  });

  const paymentType = watch('type');
  const partyType = watch('partyType');
  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
      if(isOpen) {
        getLookups().then(setLookups);
        reset(defaultValues || {
            type: 'Receipt',
            date: format(new Date(), 'yyyy-MM-dd'),
            partyType: 'Tenant',
            partyName: '',
            amount: 0,
            paymentMethod: 'Cash',
            paymentFrom: 'Petty Cash',
            status: 'Received',
        });
      }
  }, [isOpen, reset, defaultValues]);

  useEffect(() => {
    if(!defaultValues) {
        if (paymentType === 'Receipt') {
            setValue('partyType', 'Tenant');
            setValue('status', 'Received');
        } else { // Payment
            setValue('partyType', 'Landlord');
            setValue('status', 'Paid');
        }
        setValue('partyName', '');
    }
  }, [paymentType, setValue, defaultValues]);
  
  const partyOptions = {
      'Tenant': lookups.tenants,
      'Landlord': lookups.landlords,
      'Vendor': lookups.vendors,
      'Customer': lookups.customers
  }[partyType] || [];


  const onSubmit = async (data: PaymentFormData) => {
    setIsSaving(true);
    const result = await addPayment(data);

    if (result.success) {
      toast({
        title: 'Payment Recorded',
        description: `Successfully recorded payment of ${data.amount}.`,
      });
       if(associatedInvoiceId && data.type === 'Receipt') {
        await updateInvoiceStatus(associatedInvoiceId, 'Paid');
        toast({ title: 'Invoice Updated', description: 'Invoice status set to Paid.'});
      }
      setIsOpen(false);
      onPaymentAdded();
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
      {!children && <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Payment</Button></DialogTrigger>}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Record a New Payment</DialogTitle>
            <DialogDescription>
                Fill in the details below to record a new financial transaction.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Receipt">Receipt (Incoming)</SelectItem>
                                        <SelectItem value="Payment">Payment (Outgoing)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" {...register('date')} />
                        {errors.date && <p className="text-destructive text-xs mt-1">{errors.date.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Party Type</Label>
                        <Controller
                            name="partyType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                    setValue('partyName', '');
                                }} value={field.value}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                         {paymentType === 'Receipt' ? (
                                            <>
                                                <SelectItem value="Tenant">Tenant</SelectItem>
                                                <SelectItem value="Customer">Customer</SelectItem>
                                            </>
                                         ) : (
                                            <>
                                                <SelectItem value="Landlord">Landlord</SelectItem>
                                                <SelectItem value="Vendor">Vendor</SelectItem>
                                            </>
                                         )}
                                    </SelectContent>
                                </Select>
                            )} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="partyName">Party Name</Label>
                        <Controller
                            name="partyName"
                            control={control}
                            render={({ field }) => (
                                <Combobox
                                    options={partyOptions}
                                    value={field.value}
                                    onSelect={(value) => setValue('partyName', value)}
                                    placeholder={`Select ${partyType}`}
                                />
                            )}
                        />
                         {errors.partyName && <p className="text-destructive text-xs mt-1">{errors.partyName.message}</p>}
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" {...register('amount', { valueAsNumber: true })} />
                        {errors.amount && <p className="text-destructive text-xs mt-1">{errors.amount.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                         <Controller
                            name="paymentMethod"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                        <SelectItem value="Cheque">Cheque</SelectItem>
                                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="Card">Card</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                    </div>
                </div>
                 
                 {paymentMethod === 'Cash' && (
                    <div className="space-y-2">
                        <Label>Payment From</Label>
                         <Controller
                            name="paymentFrom"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Bank" id="bank" />
                                        <Label htmlFor="bank">Bank</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Petty Cash" id="petty-cash" />
                                        <Label htmlFor="petty-cash">Petty Cash</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>
                 )}

                 <div className="space-y-2">
                    <Label htmlFor="bankAccountId">Bank Account</Label>
                    <Controller
                        name="bankAccountId"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select a bank account (optional)"/></SelectTrigger>
                                <SelectContent>
                                    {lookups.bankAccounts.map(account => (
                                        <SelectItem key={account.value} value={account.value}>{account.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="referenceNo">Reference No.</Label>
                    <Input id="referenceNo" placeholder="Cheque No, Transaction ID, Installment ID etc." {...register('referenceNo')} />
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
                    Record Payment
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
