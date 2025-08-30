

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProcessedDocument } from '@/ai/flows/process-document-flow';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';
import { createBillFromDocument, createInvoiceFromDocument, createReceiptFromDocument, getNextBillNumber } from './actions';
import { format } from 'date-fns';
import { type UserRole } from '../admin/user-roles/schema';
import { getProductsForSelect } from '../stores/actions';
import { getExpenseAccounts, getRevenueAccounts } from '../finance/chart-of-accounts/lookups';
import { getContractLookups, getUnitsForProperty, getRoomsForUnit } from '@/app/tenancy/contract/actions';
import { type Product } from '../products/schema';
import { Switch } from '@/components/ui/switch';

type PartyLookups = {
    vendors: { value: string, label: string }[];
    tenants: { value: string, label: string }[];
    customers: { value: string, label: string }[];
}

interface DocumentProcessorFormProps {
    processedData: ProcessedDocument;
    lookups: PartyLookups;
    currentUser: UserRole;
    onSuccess: () => void;
}

const formSchema = z.object({
  documentType: z.enum(['Bill', 'Invoice', 'Receipt']),
  billNo: z.string().optional(),
  partyType: z.string(),
  partyCode: z.string().min(1, 'Please select a party.'),
  date: z.string(),
  dueDate: z.string().optional(),
  vatRegNo: z.string().optional(),
  property: z.string().optional(),
  unitCode: z.string().optional(),
  roomCode: z.string().optional(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    total: z.number(),
    expenseAccountId: z.string().optional(),
  })),
  subTotal: z.number().optional(),
  tax: z.number().optional(),
  taxType: z.enum(['exclusive', 'inclusive']).optional().default('exclusive'),
  taxRate: z.number().optional().default(0),
  total: z.number(),
  notes: z.string().optional(),
  expenseAccountId: z.string().optional(), // For receipts
});

type FormData = z.infer<typeof formSchema>;

export function DocumentProcessorForm({ processedData, lookups, currentUser, onSuccess }: DocumentProcessorFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [expenseAccounts, setExpenseAccounts] = useState<{value: string; label: string}[]>([]);
  const [revenueAccounts, setRevenueAccounts] = useState<{value: string; label: string}[]>([]);
  const [propertyLookups, setPropertyLookups] = useState<{properties: any[], units: any[], rooms: any[]}>({properties:[], units:[], rooms:[]});
  const [isAutoBillNo, setIsAutoBillNo] = useState(true);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { control, register, handleSubmit, watch, setValue, reset } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchedItems = watch('items');
  const documentType = watch('documentType');
  const partyType = watch('partyType');
  const watchedProperty = watch('property');
  const watchedUnit = watch('unitCode');

  useEffect(() => {
    getProductsForSelect().then(data => setProducts(data as any));
    getExpenseAccounts().then(setExpenseAccounts);
    getRevenueAccounts().then(setRevenueAccounts);
    getContractLookups().then(data => setPropertyLookups(prev => ({...prev, properties: data.properties})))
  }, []);
  
  useEffect(() => {
    if(watchedProperty) {
      getUnitsForProperty(watchedProperty).then(units => setPropertyLookups(prev => ({...prev, units})));
    }
  }, [watchedProperty]);
  
  useEffect(() => {
    if(watchedUnit) {
      getRoomsForUnit(watchedProperty!, watchedUnit).then(rooms => setPropertyLookups(prev => ({...prev, rooms})));
    }
  }, [watchedUnit, watchedProperty]);

  useEffect(() => {
    const initializeForm = async () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const nextBillNo = await getNextBillNumber();
        reset({
            documentType: processedData.documentType === 'Other' ? 'Bill' : processedData.documentType,
            billNo: nextBillNo,
            partyType: 'Vendor',
            partyCode: '',
            date: processedData.date || today,
            dueDate: processedData.dueDate || today,
            vatRegNo: processedData.vatRegNo,
            items: processedData.items.map(item => ({...item, total: item.quantity * item.unitPrice, expenseAccountId: ''})),
            subTotal: processedData.subTotal,
            tax: processedData.tax,
            total: processedData.total,
            notes: `Processed from uploaded document.`,
            taxType: 'exclusive',
            taxRate: 0,
        })
    }
    initializeForm();
  }, [processedData, reset]);

  const partyOptions = {
      'Vendor': lookups.vendors,
      'Tenant': lookups.tenants,
      'Customer': lookups.customers
  }[partyType] || [];

  const handleItemSelect = (index: number, value: string) => {
    const product = products.find(p => p.itemCode.toLowerCase() === value.toLowerCase() || p.itemName.toLowerCase() === value.toLowerCase());
    if(product) {
        setValue(`items.${index}.description`, product.itemName);
        setValue(`items.${index}.unitPrice`, product.costPrice || product.salePrice || 0);
    } else {
        setValue(`items.${index}.description`, value);
    }
  }

  const handleCreate = async (data: FormData) => {
    setIsSaving(true);
    let result;

    const itemsWithIds = data.items.map(item => ({ ...item, id: `item-${Date.now()}-${Math.random()}`}));

    const commonData = {
        ...data,
        items: itemsWithIds,
    };

    if (data.documentType === 'Bill') {
        const billData = {
            ...commonData,
            vendorCode: data.partyCode,
            vendorName: lookups.vendors.find(v => v.value === data.partyCode)?.label || data.partyCode,
            billDate: data.date,
            status: 'Paid' as const,
        };
        result = await createBillFromDocument(billData, isAutoBillNo, currentUser);

    } else if (data.documentType === 'Invoice') {
        const invoiceData = {
             ...commonData,
             customerCode: data.partyCode,
             customerName: (lookups.customers.find(c => c.value === data.partyCode)?.label || lookups.tenants.find(t => t.value === data.partyCode)?.label) || data.partyCode,
             invoiceDate: data.date,
             status: 'Paid'
        };
         result = await createInvoiceFromDocument(invoiceData, currentUser);
    } else { // Receipt
         const receiptData = {
            partyType: data.partyType,
            partyName: data.partyCode,
            amount: data.total,
            date: data.date,
            paymentMethod: 'Cash',
            paymentFrom: 'Petty Cash',
            description: `Payment for uploaded receipt. ${data.notes || ''}`,
            property: data.property,
            unitCode: data.unitCode,
            roomCode: data.roomCode,
            expenseAccountId: data.expenseAccountId
        };
        result = await createReceiptFromDocument(receiptData, currentUser);
    }

    if (result.success) {
      toast({ title: 'Success', description: `${data.documentType} created successfully.` });
      onSuccess();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extracted Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Document Type</Label>
                     <Controller name="documentType" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Bill">Bill (from a Vendor)</SelectItem><SelectItem value="Invoice">Invoice (to a Customer/Tenant)</SelectItem><SelectItem value="Receipt">Payment Receipt</SelectItem></SelectContent></Select>)} />
                </div>
                 <div>
                    <Label>Party Type</Label>
                     <Controller name="partyType" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Vendor">Vendor</SelectItem><SelectItem value="Customer">Customer</SelectItem><SelectItem value="Tenant">Tenant</SelectItem></SelectContent></Select>)} />
                </div>
            </div>

            {documentType === 'Bill' && (
                <div className="flex items-end gap-2"><div className="flex-grow"><Label>Bill No.</Label><Input {...register('billNo')} disabled={isAutoBillNo} /></div><div className="flex items-center space-x-2 pb-1"><Switch id="auto-bill-no" checked={isAutoBillNo} onCheckedChange={setIsAutoBillNo} /><Label htmlFor="auto-bill-no">Auto-generate</Label></div></div>
            )}

            <div><Label>Party Name</Label><Controller name="partyCode" control={control} render={({ field }) => (<Combobox options={partyOptions} value={field.value} onSelect={field.onChange} placeholder={`Select a ${partyType}...`} />)} /></div>
            <div className="grid grid-cols-2 gap-4"><div><Label>Date</Label><Input type="date" {...register('date')} /></div><div><Label>Due Date</Label><Input type="date" {...register('dueDate')} /></div></div>
            <div><Label>VAT / Tax Registration No.</Label><Input {...register('vatRegNo')} /></div>
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div><Label>Property</Label><Controller name="property" control={control} render={({ field }) => (<Combobox options={propertyLookups.properties} value={field.value || ''} onSelect={value => { field.onChange(value); setValue('unitCode', ''); setValue('roomCode',''); }} placeholder="Select property"/>)} /></div>
                 <div><Label>Unit</Label><Controller name="unitCode" control={control} render={({ field }) => (<Combobox options={propertyLookups.units.filter(u => u.propertyCode === watchedProperty)} value={field.value || ''} onSelect={value => { field.onChange(value); setValue('roomCode',''); }} placeholder="Select unit" disabled={!watchedProperty}/>)} /></div>
                 <div><Label>Room</Label><Controller name="roomCode" control={control} render={({ field }) => (<Combobox options={propertyLookups.rooms.filter(r => r.propertyCode === watchedProperty && r.unitCode === watchedUnit)} value={field.value || ''} onSelect={field.onChange} placeholder="Select room" disabled={!watchedUnit}/>)} /></div>
            </div>

            {documentType !== 'Receipt' && <div className="space-y-2"><Label>Line Items</Label>
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-2 items-center">
                        <Combobox options={products.map(p => ({ value: p.itemCode, label: p.itemName }))} value={watchedItems?.[index]?.description || ''} onSelect={(value) => handleItemSelect(index, value)} placeholder="Select or type item..." />
                        <Controller name={`items.${index}.expenseAccountId`} control={control} render={({ field }) => (<Combobox options={expenseAccounts} value={field.value || ''} onSelect={(value) => field.onChange(value)} placeholder="Expense Account" />)} />
                        <Input type="number" step="any" placeholder="Qty" {...register(`items.${index}.quantity`, { valueAsNumber: true })} className="w-20"/>
                        <Input type="number" step="any" placeholder="Price" {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} className="w-24"/>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </div>
                ))}
                <Button type="button" size="sm" variant="outline" onClick={() => append({ description: '', quantity: 1, unitPrice: 0, total: 0, expenseAccountId: '' })}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
            </div>}

            <div className="grid grid-cols-2 gap-4">
              <div><Label>Subtotal</Label><Input type="number" step="any" {...register('subTotal', {valueAsNumber: true})} disabled={documentType === 'Receipt'} /></div>
              <div><Label>Tax</Label><Input type="number" step="any" {...register('tax', {valueAsNumber: true})} disabled={documentType === 'Receipt'} /></div>
            </div>
             <div>
                <Label>Total Amount</Label>
                <Input type="number" step="any" {...register('total', {valueAsNumber: true})} />
            </div>
             {documentType === 'Receipt' && (
                 <div>
                    <Label>Account</Label>
                    <Controller
                        name="expenseAccountId"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                options={revenueAccounts}
                                value={field.value || ''}
                                onSelect={(value) => field.onChange(value)}
                                placeholder="Select revenue account"
                            />
                        )}
                    />
                </div>
             )}
             <div><Label>Notes</Label><Textarea {...register('notes')} /></div>
             <CardFooter className="px-0 pt-4"><Button type="submit" disabled={isSaving}>{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Create {documentType}</Button></CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
