

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { addPayment, getReferences } from './actions';
import { getLookups } from '@/app/lookups/actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { getUnitsForProperty, getRoomsForUnit } from '@/app/tenancy/contract/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { type Invoice } from '@/app/tenancy/customer/invoice/schema';
import { getInvoicesForCustomer } from '@/app/tenancy/customer/invoice/actions';
import { getBillsForVendor } from '@/app/vendors/bill/actions';
import { type Bill } from '@/app/vendors/bill/schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Agent } from '@/app/vendors/agents/schema';
import { type ReceiptBook } from '../book-management/schema';


type PaymentFormData = z.infer<typeof paymentSchema>;

type Lookups = {
    tenants: { value: string, label: string }[];
    landlords: { value: string, label: string }[];
    vendors: { value: string, label: string }[];
    agents: (Agent & { value: string, label: string })[];
    customers: { value: string, label: string }[];
    bankAccounts: { value: string, label: string }[];
    properties: {value: string, label: string}[];
    units: {value: string, label: string}[];
    rooms: {value: string, label: string}[];
    partitions: {value: string, label: string}[];
    references: {value: string, label: string, amount?: number, propertyCode?: string, unitCode?: string, roomCode?: string, partitionCode?: string, book?: ReceiptBook}[];
    users: { value: string, label: string }[];
    receiptBooks: ReceiptBook[];
    expenseAccounts: { value: string; label: string; }[];
}

interface AddPaymentDialogProps {
  onPaymentAdded: () => void;
  children?: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  defaultValues?: Partial<PaymentFormData>;
  customerInvoices?: Invoice[];
  vendorBills?: Bill[];
}

export function AddPaymentDialog({ onPaymentAdded, children, isOpen: externalOpen, setIsOpen: setExternalOpen, defaultValues, customerInvoices = [], vendorBills = [] }: AddPaymentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen ?? internalOpen;
  const setIsOpen = setExternalOpen ?? setInternalOpen;
  
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<Lookups>({ tenants: [], landlords: [], vendors: [], agents: [], customers: [], bankAccounts: [], properties: [], units: [], rooms: [], partitions: [], references: [], users: [], receiptBooks: [], expenseAccounts: [] });
  const [currentUser, setCurrentUser] = useState<string>('');

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
  
  const { fields: invoiceFields, append: appendInvoice, remove: removeInvoice } = useFieldArray({
    control,
    name: "invoiceAllocations"
  });
  const { fields: billFields, append: appendBill, remove: removeBill } = useFieldArray({
    control,
    name: "billAllocations"
  });


  const paymentType = watch('type');
  const partyType = watch('partyType');
  const partyName = watch('partyName');
  const referenceType = watch('referenceType');
  const paymentMethod = watch('paymentMethod');
  const watchedProperty = watch('property');
  const watchedUnit = watch('unitCode');
  const paymentFrom = watch('paymentFrom');
  const watchedInvoiceAllocations = watch('invoiceAllocations');
  const watchedBillAllocations = watch('billAllocations');
  const watchedCollector = watch('createdByUser');
  const watchedReferenceNo = watch('referenceNo');

  const [invoicesForCustomer, setInvoicesForCustomer] = useState<Invoice[]>(customerInvoices);
  const [billsForVendor, setBillsForVendor] = useState<Bill[]>(vendorBills);
  
  useEffect(() => {
    const userProfile = sessionStorage.getItem('userProfile');
    if(userProfile) {
        setCurrentUser(JSON.parse(userProfile).name);
    }
  }, []);

  useEffect(() => {
    if (watchedInvoiceAllocations) {
        const totalAllocated = watchedInvoiceAllocations.reduce((sum, current) => sum + (current.amount || 0), 0);
        setValue('amount', totalAllocated);
    }
  }, [watchedInvoiceAllocations, setValue]);
  
   useEffect(() => {
    if (watchedBillAllocations) {
        const totalAllocated = watchedBillAllocations.reduce((sum, current) => sum + (current.amount || 0), 0);
        setValue('amount', totalAllocated);
    }
  }, [watchedBillAllocations, setValue]);


  useEffect(() => {
    getLookups().then(data => setLookups(data));
  }, [])
  
   useEffect(() => {
    const fetchInvoicesAndBills = async () => {
        if(partyType === 'Customer' && partyName) {
            const data = await getInvoicesForCustomer(partyName);
            setInvoicesForCustomer(data);
            const defaultAllocs = defaultValues?.invoiceAllocations || [];
            const currentAllocs = watch('invoiceAllocations') || [];

            if(defaultAllocs.length > 0) {
                setValue('invoiceAllocations', defaultAllocs);
            } else if (currentAllocs.length === 0) {
                setValue('invoiceAllocations', data
                    .filter(inv => inv.status !== 'Paid' && inv.status !== 'Cancelled')
                    .map(inv => ({ invoiceId: inv.id, amount: 0}))
                );
            }
        } else {
            setInvoicesForCustomer([]);
        }

        if(partyType === 'Vendor' && partyName) {
            const data = await getBillsForVendor(partyName);
            setBillsForVendor(data);
            const defaultAllocs = defaultValues?.billAllocations || [];
            const currentAllocs = watch('billAllocations') || [];
            if(defaultAllocs.length > 0) {
                setValue('billAllocations', defaultAllocs);
            } else if (currentAllocs.length === 0) {
                setValue('billAllocations', data
                    .filter(bill => bill.status !== 'Paid' && bill.status !== 'Cancelled')
                    .map(bill => ({ billId: bill.id, amount: 0}))
                );
            }
        } else {
            setBillsForVendor([]);
        }
    };
    if (isOpen) {
        fetchInvoicesAndBills();
    }
   }, [isOpen, partyType, partyName, setValue, watch, defaultValues]);
   
   useEffect(() => {
    const fetchReferences = async () => {
        if (referenceType) {
            const data = await getReferences(partyType, partyName, referenceType, paymentType, watchedCollector);
            setLookups(prev => ({...prev, references: data}));
        } else {
            setLookups(prev => ({...prev, references: []}));
        }
    };
    fetchReferences();
   }, [partyType, partyName, referenceType, paymentType, watchedCollector]);


   useEffect(() => {
    const fetchUnits = async () => {
        if (watchedProperty) {
            const units = await getUnitsForProperty(watchedProperty);
            setLookups(prev => ({...prev, units}));
        } else {
            setLookups(prev => ({...prev, units: [], rooms: []}));
        }
    }
    fetchUnits();
  }, [watchedProperty]);

  useEffect(() => {
    const fetchSubUnits = async () => {
        if (watchedProperty && watchedUnit) {
            const rooms = await getRoomsForUnit(watchedProperty, watchedUnit);
            setLookups(prev => ({...prev, rooms, partitions: []}));
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
            billAllocations: [],
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

  useEffect(() => {
    if (referenceType === 'Receipt Book' && watchedReferenceNo) {
        const receiptNumberOnly = watchedReferenceNo.split('-').pop()?.trim();
        if (receiptNumberOnly && /^\d+$/.test(receiptNumberOnly)) {
             const leafNumber = parseInt(receiptNumberOnly, 10);
             for(const book of lookups.receiptBooks) {
                if(leafNumber >= book.receiptStartNo && leafNumber <= book.receiptEndNo) {
                    if (book.assignedTo && book.assignedTo !== watchedCollector) {
                        setValue('createdByUser', book.assignedTo);
                    }
                    const formattedRef = `Book: ${book.bookNo}, Receipt: ${leafNumber}`;
                    const existingRef = lookups.references.find(r => r.label === formattedRef);
                    if(!existingRef) {
                        setValue('referenceNo', `Book: ${book.bookNo}-${leafNumber}`);
                    }
                    break;
                }
             }
        }
    }
  }, [watchedReferenceNo, referenceType, lookups.receiptBooks, setValue, watchedCollector, lookups.references]);
  
  const partyOptions = {
      'Tenant': lookups.tenants,
      'Landlord': lookups.landlords,
      'Vendor': lookups.vendors,
      'Agent': lookups.agents,
      'Customer': lookups.customers
  }[partyType] || [];


  const onSubmit = async (data: PaymentFormData) => {
    setIsSaving(true);
    const result = await addPayment({...data, createdByUser: currentUser});

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
    if (selectedRef) {
        if (selectedRef.amount) {
            setValue('amount', selectedRef.amount);
        }
        setValue('description', `Payment for ${referenceType}: ${selectedRef.label}`);

        if (selectedRef.propertyCode) {
            setValue('property', selectedRef.propertyCode);
            setTimeout(() => {
                if(selectedRef.unitCode) setValue('unitCode', selectedRef.unitCode);
                if(selectedRef.roomCode) setValue('roomCode', selectedRef.roomCode);
            }, 200);
        }
    }
  }

  const handlePartySelect = (partyCode: string) => {
    setValue('partyName', partyCode);

    if (partyType === 'Agent') {
        const selectedAgent = lookups.agents.find(agent => agent.value === partyCode);
        if (selectedAgent && selectedAgent.commissionRate) {
            setValue('amount', selectedAgent.commissionRate);
        }
        setValue('agentCode', partyCode);
    }
  };

  const referenceTypeOptions = () => {
    if (paymentType === 'Payment') {
        return [
            <SelectItem key="Lease Contract" value="Lease Contract">Lease Contract</SelectItem>,
            <SelectItem key="Bill" value="Bill">Bill</SelectItem>,
        ];
    } else { // Receipt
        return [
            <SelectItem key="Tenancy Contract" value="Tenancy Contract">Tenancy Contract</SelectItem>,
            <SelectItem key="Invoice" value="Invoice">Invoice</SelectItem>,
            <SelectItem key="Receipt Book" value="Receipt Book">Receipt Book</SelectItem>,
        ];
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
                        <div className="space-y-2"><Label>Payment Date *</Label><Controller name="date" control={control} render={({ field }) => ( <Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Input type="date" value={field.value} onChange={e => field.onChange(e.target.value)} /></PopoverContent></Popover>)} /></div>
                        <div className="space-y-2"><Label>Party Type *</Label><Controller name="partyType" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select party type"/></SelectTrigger><SelectContent><SelectItem value="Tenant">Tenant</SelectItem><SelectItem value="Landlord">Landlord</SelectItem><SelectItem value="Vendor">Vendor</SelectItem><SelectItem value="Agent">Agent</SelectItem><SelectItem value="Customer">Customer</SelectItem></SelectContent></Select>)} /></div>
                        <div className="space-y-2"><Label>Party Name *</Label><Controller name="partyName" control={control} render={({ field }) => (<Combobox options={partyOptions} value={field.value || ''} onSelect={handlePartySelect} placeholder="Select party"/>)} /></div>
                        <div className="space-y-2"><Label>Amount *</Label><Input type="number" placeholder="0.00" {...register('amount', { valueAsNumber: true })} /></div>
                        <div className="space-y-2"><Label>Payment Method *</Label><Controller name="paymentMethod" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select payment method"/></SelectTrigger><SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Cheque">Cheque</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="Card">Card</SelectItem></SelectContent></Select>)} /></div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Payment Source</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Controller
                            name="paymentFrom"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex space-x-6"
                                >
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
                        {paymentFrom === 'Bank' && (
                            <div className="space-y-2">
                                <Label>Bank Account</Label>
                                <Controller
                                    name="bankAccountId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select bank account"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lookups.bankAccounts.map(acc => (
                                                    <SelectItem key={acc.value} value={acc.value}>{acc.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle className="flex items-center space-x-2"><Building2 className="h-5 w-5 text-primary" /><span>Property Details</span></CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="space-y-2"><Label>Property</Label><Controller name="property" control={control} render={({ field }) => (<Combobox options={lookups.properties} value={field.value || ''} onSelect={value => { field.onChange(value); setValue('unitCode', ''); setValue('roomCode',''); }} placeholder="Select property"/>)} /></div>
                         <div className="space-y-2"><Label>Unit</Label><Controller name="unitCode" control={control} render={({ field }) => (<Combobox options={lookups.units} value={field.value || ''} onSelect={value => { field.onChange(value); setValue('roomCode',''); }} placeholder="Select unit" disabled={!watchedProperty}/>)} /></div>
                         <div className="space-y-2"><Label>Room</Label><Controller name="roomCode" control={control} render={({ field }) => (<Combobox options={lookups.rooms} value={field.value || ''} onSelect={field.onChange} placeholder="Select room" disabled={!watchedUnit}/>)} /></div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle className="flex items-center space-x-2"><FileText className="h-5 w-5 text-primary" /><span>Reference Information (Optional)</span></CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label>Reference Type</Label>
                                <Controller 
                                    name="referenceType" 
                                    control={control} 
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select reference type" /></SelectTrigger>
                                            <SelectContent>
                                                {referenceTypeOptions()}
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} 
                                />
                           </div>
                           {paymentType === 'Receipt' && referenceType === 'Receipt Book' && (
                                <div className="space-y-2">
                                    <Label>Collector</Label>
                                    <Controller name="createdByUser" control={control} render={({ field }) => (
                                        <Combobox 
                                            options={lookups.users} 
                                            value={field.value || ''} 
                                            onSelect={field.onChange} 
                                            placeholder="Select Collector"/>
                                    )} />
                                </div>
                            )}
                           <div className="space-y-2"><Label>Reference Number</Label><Controller name="referenceNo" control={control} render={({ field }) => (<Combobox options={lookups.references} value={field.value || ''} onSelect={handleReferenceSelect} placeholder="Enter or select a reference" />)} /></div>
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
                          {invoicesForCustomer.map((invoice, index) => {
                            const fieldIndex = invoiceFields.findIndex(f => f.invoiceId === invoice.id);
                            if (fieldIndex === -1) return null;
                            return (
                                <TableRow key={invoice.id}>
                                  <TableCell>{invoice.invoiceNo}</TableCell>
                                  <TableCell>{format(new Date(invoice.dueDate), 'PP')}</TableCell>
                                  <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.remainingBalance || 0)}</TableCell>
                                  <TableCell className="text-right">
                                    <Controller
                                      control={control}
                                      name={`invoiceAllocations.${fieldIndex}.amount`}
                                      defaultValue={0}
                                      render={({ field }) => (
                                        <Input
                                          type="number"
                                          {...field}
                                          className="text-right"
                                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                          max={invoice.remainingBalance}
                                        />
                                      )}
                                    />
                                  </TableCell>
                                </TableRow>
                              )
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
                {paymentType === 'Payment' && partyType === 'Vendor' && billsForVendor.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Bill Allocations</CardTitle>
                      <CardDescription>Allocate this payment to open bills.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Bill #</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Balance Due</TableHead>
                            <TableHead className="text-right">Allocation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {billsForVendor.map((bill, index) => {
                            const fieldIndex = billFields.findIndex(f => f.billId === bill.id);
                            if (fieldIndex === -1) return null;
                            return (
                                <TableRow key={bill.id}>
                                  <TableCell>{bill.billNo}</TableCell>
                                  <TableCell>{format(new Date(bill.dueDate), 'PP')}</TableCell>
                                  <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(bill.remainingBalance || 0)}</TableCell>
                                  <TableCell className="text-right">
                                    <Controller
                                      control={control}
                                      name={`billAllocations.${fieldIndex}.amount`}
                                      defaultValue={0}
                                      render={({ field }) => (
                                        <Input
                                          type="number"
                                          {...field}
                                          className="text-right"
                                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                          max={bill.remainingBalance}
                                        />
                                      )}
                                    />
                                  </TableCell>
                                </TableRow>
                              )
                          })}
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

    

    
