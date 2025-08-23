
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, CreditCard, Building2, FileText, Calendar as CalendarIcon, X, Receipt } from 'lucide-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, type Payment } from './schema';
import { addPayment, getLookups, getReferences } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { getContractLookups, getUnitsForProperty, getRoomsForUnit, getPartitionsForUnit } from '@/app/tenancy/contract/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { type Invoice } from '@/app/tenancy/customer/invoice/schema';
import { getInvoicesForCustomer } from '@/app/tenancy/customer/invoice/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


type PaymentFormData = z.infer<typeof paymentSchema>;

type Lookups = {
    tenants: { value: string, label: string }[];
    landlords: { value: string, label: string }[];
    vendors: { value: string, label: string }[];
    customers: { value: string, label: string }[];
    bankAccounts: { value: string, label: string }[];
    properties: {value: string, label: string}[];
    units: {value: string, label: string}[];
    rooms: {value: string, label: string}[];
    partitions: {value: string, label: string}[];
    references: {value: string, label: string, amount?: number}[];
}

interface AddPaymentDialogProps {
  onPaymentAdded: () => void;
  children?: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  defaultValues?: Partial<PaymentFormData>;
  customerInvoices?: Invoice[];
}

export function AddPaymentDialog({ onPaymentAdded, children, isOpen: externalOpen, setIsOpen: setExternalOpen, defaultValues, customerInvoices = [] }: AddPaymentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen ?? internalOpen;
  const setIsOpen = setExternalOpen ?? setInternalOpen;
  
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<Lookups>({ tenants: [], landlords: [], vendors: [], customers: [], bankAccounts: [], properties: [], units: [], rooms: [], partitions: [], references: [] });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const paymentType = watch('type');
  const partyType = watch('partyType');
  const partyName = watch('partyName');
  const referenceType = watch('referenceType');
  const paymentMethod = watch('paymentMethod');
  const watchedProperty = watch('property');
  const watchedUnit = watch('unitCode');
  const paymentFrom = watch('paymentFrom');

  const [invoicesForCustomer, setInvoicesForCustomer] = useState<Invoice[]>(customerInvoices);

  useEffect(() => {
    getContractLookups().then(data => setLookups(prev => ({...prev, properties: data.properties })));
    getLookups().then(data => setLookups(prev => ({...prev, ...data})));
  }, [])
  
   useEffect(() => {
     if(partyType === 'Customer' && partyName) {
        getInvoicesForCustomer(partyName).then(setInvoicesForCustomer);
     } else {
        setInvoicesForCustomer([]);
     }
   }, [partyType, partyName]);
   
   useEffect(() => {
    if (partyType && partyName && referenceType) {
        getReferences(partyType, partyName, referenceType).then(data => {
            setLookups(prev => ({...prev, references: data}));
        });
    } else {
        setLookups(prev => ({...prev, references: []}));
    }
   }, [partyType, partyName, referenceType]);


   useEffect(() => {
    const fetchUnits = async () => {
        if (watchedProperty) {
            const units = await getUnitsForProperty(watchedProperty);
            setLookups(prev => ({...prev, units}));
        } else {
            setLookups(prev => ({...prev, units: []}));
        }
    }
    fetchUnits();
  }, [watchedProperty]);

  useEffect(() => {
    const fetchSubUnits = async () => {
        if (watchedProperty && watchedUnit) {
            const rooms = await getRoomsForUnit(watchedProperty, watchedUnit);
            const partitions = await getPartitionsForUnit(watchedProperty, watchedUnit);
            setLookups(prev => ({...prev, rooms, partitions}));
        } else {
            setLookups(prev => ({...prev, rooms: [], partitions: []}));
        }
    }
    fetchSubUnits();
  }, [watchedProperty, watchedUnit]);


  useEffect(() => {
      if(isOpen) {
        const initialValues = defaultValues || {
            type: 'Receipt',
            date: format(new Date(), 'yyyy-MM-dd'),
            partyType: 'Tenant',
            partyName: '',
            amount: 0,
            paymentMethod: 'Cash',
            paymentFrom: 'Bank',
            status: 'Received',
            invoiceAllocations: [],
        };
        reset(initialValues);
      }
  }, [isOpen, reset, defaultValues]);

  useEffect(() => {
    if(!defaultValues) {
        if (paymentType === 'Receipt') {
            setValue('partyType', 'Tenant');
            setValue('status', 'Received');
        } else {
            setValue('partyType', 'Landlord');
            setValue('status', 'Paid');
        }
        setValue('partyName', '');
        setValue('referenceType', '');
        setValue('referenceNo', '');
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
        description: `Successfully recorded payment of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.amount)}.`,
      });
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
  
  const handleReset = () => {
    reset({
      type: 'Receipt',
      date: format(new Date(), 'yyyy-MM-dd'),
      partyType: 'Tenant',
      partyName: '',
      amount: 0,
      paymentMethod: 'Cash',
      paymentFrom: 'Bank',
      status: 'Received',
    });
  }

  const handleReferenceSelect = (value: string) => {
    setValue('referenceNo', value);
    const selectedRef = lookups.references.find(r => r.value === value);
    if(selectedRef) {
        if(selectedRef.amount) {
            setValue('amount', selectedRef.amount);
        }
        setValue('description', `Payment for ${referenceType}: ${selectedRef.label}`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
         <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Payment</Button></DialogTrigger>
      )}
      <DialogContent className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Receipt className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <DialogTitle>Record New Payment</DialogTitle>
                    </div>
                </div>
            </DialogHeader>
            <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <Card>
                    <CardHeader><CardTitle className="flex items-center space-x-2"><CreditCard className="h-5 w-5 text-primary" /><span>Payment Details</span></CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label>Payment Type *</Label><Controller name="type" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select payment type"/></SelectTrigger><SelectContent><SelectItem value="Receipt">Receipt (Incoming)</SelectItem><SelectItem value="Payment">Payment (Outgoing)</SelectItem></SelectContent></Select>)} /></div>
                        <div className="space-y-2"><Label>Payment Date *</Label><Controller name="date" control={control} render={({ field }) => ( <Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')} initialFocus /></PopoverContent></Popover>)} /></div>
                        <div className="space-y-2"><Label>Party Type *</Label><Controller name="partyType" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select party type"/></SelectTrigger><SelectContent><SelectItem value="Tenant">Tenant</SelectItem><SelectItem value="Landlord">Landlord</SelectItem><SelectItem value="Vendor">Vendor</SelectItem><SelectItem value="Customer">Customer</SelectItem></SelectContent></Select>)} /></div>
                        <div className="space-y-2"><Label>Party Name *</Label><Controller name="partyName" control={control} render={({ field }) => (<Combobox options={partyOptions} value={field.value || ''} onSelect={field.onChange} placeholder="Select party"/>)} /></div>
                        <div className="space-y-2"><Label>Amount *</Label><Input type="number" placeholder="0.00" {...register('amount', { valueAsNumber: true })}/></div>
                        <div className="space-y-2"><Label>Payment Method *</Label><Controller name="paymentMethod" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select payment method"/></SelectTrigger><SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="Cheque">Cheque</SelectItem><SelectItem value="Card">Card</SelectItem></SelectContent></Select>)} /></div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Payment Source</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Controller name="paymentFrom" control={control} render={({ field }) => (<RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-6"><div className="flex items-center space-x-2"><RadioGroupItem value="Bank" id="bank" /><Label htmlFor="bank">Bank</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Petty Cash" id="petty-cash" /><Label htmlFor="petty-cash">Petty Cash</Label></div></RadioGroup>)} />
                        {paymentFrom === 'Bank' && <div className="space-y-2"><Label>Bank Account</Label><Controller name="bankAccountId" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select bank account"/></SelectTrigger><SelectContent>{lookups.bankAccounts.map(acc => <SelectItem key={acc.value} value={acc.value}>{acc.label}</SelectItem>)}</SelectContent></Select>)} /></div>}
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle className="flex items-center space-x-2"><Building2 className="h-5 w-5 text-primary" /><span>Property Details</span></CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                         <div className="space-y-2"><Label>Property</Label><Controller name="property" control={control} render={({ field }) => (<Combobox options={lookups.properties} value={field.value || ''} onSelect={value => { field.onChange(value); setValue('unitCode', ''); setValue('roomCode',''); setValue('partitionCode',''); }} placeholder="Select property"/>)} /></div>
                         <div className="space-y-2"><Label>Unit</Label><Controller name="unitCode" control={control} render={({ field }) => (<Combobox options={lookups.units} value={field.value || ''} onSelect={value => { field.onChange(value); setValue('roomCode',''); setValue('partitionCode',''); }} placeholder="Select unit" disabled={!watchedProperty}/>)} /></div>
                         <div className="space-y-2"><Label>Room</Label><Controller name="roomCode" control={control} render={({ field }) => (<Combobox options={lookups.rooms} value={field.value || ''} onSelect={field.onChange} placeholder="Select room" disabled={!watchedUnit}/>)} /></div>
                         <div className="space-y-2"><Label>Partition</Label><Controller name="partitionCode" control={control} render={({ field }) => (<Combobox options={lookups.partitions} value={field.value || ''} onSelect={field.onChange} placeholder="Select partition" disabled={!watchedUnit}/>)} /></div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle className="flex items-center space-x-2"><FileText className="h-5 w-5 text-primary" /><span>Reference Information</span></CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2"><Label>Reference Type</Label><Controller name="referenceType" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select reference type" /></SelectTrigger><SelectContent><SelectItem value="Invoice">Invoice</SelectItem><SelectItem value="Tenancy Contract">Tenancy Contract</SelectItem><SelectItem value="Lease Contract">Lease Contract</SelectItem><SelectItem value="Utility Bill">Utility Bill</SelectItem><SelectItem value="Maintenance Bill">Maintenance Bill</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>)} /></div>
                           <div className="space-y-2"><Label>Reference Number</Label><Controller name="referenceNo" control={control} render={({ field }) => (<Combobox options={lookups.references} value={field.value || ''} onSelect={handleReferenceSelect} placeholder="Enter reference number" />)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Additional notes or description" rows={3} {...register('description')} /></div>
                    </CardContent>
                </Card>

                 {paymentType === 'Receipt' && partyType === 'Customer' && invoicesForCustomer.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Invoice Allocations</CardTitle>
                      <CardDescription>Allocate this payment to open invoices.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Balance Due</TableHead>
                            <TableHead className="text-right">Allocation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoicesForCustomer.map((invoice, index) => (
                            <TableRow key={invoice.id}>
                              <TableCell>{invoice.invoiceNo}</TableCell>
                              <TableCell>{format(new Date(invoice.dueDate), 'PP')}</TableCell>
                              <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.remainingBalance || 0)}</TableCell>
                              <TableCell className="text-right">
                                 <Controller
                                  control={control}
                                  name={`invoiceAllocations.${index}.amount`}
                                  defaultValue={defaultValues?.invoiceAllocations?.find(i => i.invoiceId === invoice.id)?.amount || 0}
                                  render={({ field }) => (
                                    <>
                                      <Input type="hidden" {...register(`invoiceAllocations.${index}.invoiceId`)} value={invoice.id} />
                                      <Input type="number" {...field} className="text-right" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                                    </>
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={handleReset}><X className="mr-2 h-4 w-4"/>Clear</Button>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
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
