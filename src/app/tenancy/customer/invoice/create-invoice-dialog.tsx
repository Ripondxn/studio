

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, X } from 'lucide-react';
import { saveInvoice, getNextGeneralInvoiceNumber } from './actions';
import { getLookups, getExpenseAccounts } from '@/app/lookups/actions';
import { type Invoice, invoiceSchema } from './schema';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { useCurrency } from '@/context/currency-context';
import { type Product } from '@/app/products/schema';
import { Combobox } from '@/components/ui/combobox';

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  customer: { code: string; name: string };
  onSuccess: () => void;
}

export function CreateInvoiceDialog({ isOpen, setIsOpen, customer, onSuccess }: CreateInvoiceDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoInvoiceNo, setIsAutoInvoiceNo] = useState(true);
  const { formatCurrency } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [lookups, setLookups] = useState<{ properties: {value: string, label: string}[]; units: {value: string, label: string, propertyCode: string}[]; rooms: {value: string, label: string, propertyCode: string, unitCode?: string}[]; expenseAccounts: {value: string, label: string}[] }>({ properties: [], units: [], rooms: [], expenseAccounts: [] });

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });
  
  const { control, register, handleSubmit, reset, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate');
  const watchedTaxType = watch('taxType');
  const watchedProperty = watch('property');
  const watchedUnit = watch('unitCode');
  
  useEffect(() => {
    getLookups().then(data => {
        setLookups(prev => ({...prev, properties: data.properties, units: data.units, rooms: data.rooms, expenseAccounts: data.expenseAccounts || []}));
        setProducts(data.products || []);
    });
  }, []);
  
  const filteredUnits = useMemo(() => lookups.units.filter(u => u.propertyCode === watchedProperty), [lookups.units, watchedProperty]);
  const filteredRooms = useMemo(() => lookups.rooms.filter(r => r.propertyCode === watchedProperty && r.unitCode === watchedUnit), [lookups.rooms, watchedProperty, watchedUnit]);

  useEffect(() => {
    if (!watchedItems) return;
    
    watchedItems.forEach((item, index) => {
        const total = item.quantity * item.unitPrice;
        if (item.total !== total) {
            setValue(`items.${index}.total`, total);
        }
    });

    const subTotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxRate = watchedTaxRate || 0;
    
    let taxAmount = 0;
    let totalAmount = subTotal;
    let finalSubTotal = subTotal;

    if (watchedTaxType === 'exclusive') {
        taxAmount = subTotal * (taxRate / 100);
        totalAmount = subTotal + taxAmount;
    } else { 
        taxAmount = subTotal - (subTotal / (1 + (taxRate / 100)));
        finalSubTotal = subTotal - taxAmount;
        totalAmount = subTotal;
    }

    setValue('subTotal', finalSubTotal);
    setValue('tax', taxAmount);
    setValue('total', totalAmount);

  }, [watchedItems, watchedTaxRate, watchedTaxType, setValue]);
  
  useEffect(() => {
    const initializeForm = async () => {
        if (!customer) return;

        const newInvoiceNo = await getNextGeneralInvoiceNumber();
        setIsAutoInvoiceNo(true);

        reset({
            invoiceNo: newInvoiceNo,
            customerCode: customer.code,
            customerName: customer.name,
            property: '',
            unitCode: '',
            roomCode: '',
            invoiceDate: format(new Date(), 'yyyy-MM-dd'),
            dueDate: format(new Date(), 'yyyy-MM-dd'),
            vatRegNo: '',
            items: [{ id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 }],
            subTotal: 0,
            tax: 0,
            taxType: 'exclusive',
            taxRate: 0,
            total: 0,
            notes: '',
            status: 'Draft',
        });
    };
    if (isOpen) {
      initializeForm();
    }
  }, [isOpen, reset, customer]);

  const onSubmit = async (data: InvoiceFormData) => {
    const userProfile = sessionStorage.getItem('userProfile');
    if(!userProfile) {
        toast({variant: 'destructive', title: 'Error', description: 'Could not identify current user.'});
        return;
    }
    const currentUser = JSON.parse(userProfile);

    setIsSaving(true);
    const result = await saveInvoice({ ...data, isAutoInvoiceNo }, currentUser.name);
    if(result.success) {
        toast({ title: 'Success', description: 'Invoice saved successfully.'});
        onSuccess();
        setIsOpen(false);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to save invoice.'});
    }
    setIsSaving(false);
  }
  
  const handleItemSelect = (index: number, value: string, label?: string) => {
    const product = products.find(p => p.itemCode.toLowerCase() === value.toLowerCase() || p.itemName.toLowerCase() === value.toLowerCase());
    if(product) {
        setValue(`items.${index}.description`, product.itemName);
        setValue(`items.${index}.unitPrice`, product.salePrice);
    } else {
        setValue(`items.${index}.description`, label || value);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Creating a new invoice for {customer.name}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto p-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              <div><Label>Invoice #</Label><Input {...register('invoiceNo')} disabled={isAutoInvoiceNo} /></div>
              <div><Label>Customer</Label><Input value={customer.name} disabled/></div>
              <div><Label>Invoice Date</Label><Input type="date" {...register('invoiceDate')}/></div>
              <div><Label>Due Date</Label><Input type="date" {...register('dueDate')}/></div>
            </div>
             <div className="flex items-center space-x-2 mb-4">
                <Switch 
                    id="auto-invoice-no-switch"
                    checked={isAutoInvoiceNo}
                    onCheckedChange={setIsAutoInvoiceNo}
                />
                <Label htmlFor="auto-invoice-no-switch">Auto-generate Invoice No</Label>
            </div>
             <div className="space-y-2 mb-4">
                <Label>VAT / Tax Registration No.</Label>
                <Input {...register('vatRegNo')} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <div>
                    <Label>Property</Label>
                     <Controller name="property" control={control} render={({ field }) => (<Combobox options={lookups.properties || []} value={field.value || ''} onSelect={value => { field.onChange(value); setValue('unitCode', ''); setValue('roomCode',''); }} placeholder="Select property"/>)} />
                </div>
                <div>
                    <Label>Unit</Label>
                    <Controller name="unitCode" control={control} render={({ field }) => (<Combobox options={filteredUnits} value={field.value || ''} onSelect={value => { field.onChange(value); setValue('roomCode',''); }} placeholder="Select unit" disabled={!watchedProperty}/>)} />
                </div>
                <div>
                    <Label>Room</Label>
                    <Controller name="roomCode" control={control} render={({ field }) => (<Combobox options={filteredRooms} value={field.value || ''} onSelect={field.onChange} placeholder="Select room" disabled={!watchedUnit}/>)} />
                </div>
            </div>
            
            <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead className="w-2/5">Item / Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {fields.map((field, index) => (
                      <TableRow key={field.id}>
                          <TableCell>
                            <Combobox
                                options={products.map(p => ({value: p.itemCode, label: p.itemName}))}
                                value={watchedItems?.[index]?.description || ''}
                                onSelect={(value, label) => handleItemSelect(index, value, label)}
                                placeholder="Select or type item..."
                             />
                          </TableCell>
                          <TableCell><Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1 })} /></TableCell>
                          <TableCell><Input type="number" step="0.01" {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} /></TableCell>
                          <TableCell className="text-right">
                            {formatCurrency((watchedItems?.[index]?.quantity || 0) * (watchedItems?.[index]?.unitPrice || 0))}
                          </TableCell>
                          <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button></TableCell>
                      </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 })}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>

              <div className="flex justify-end mt-4">
                  <div className="w-full max-w-sm space-y-2">
                      <div className="flex justify-between items-center">
                          <Label>Subtotal</Label>
                          <span className="font-medium">{formatCurrency(watch('subTotal') || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <Label>Tax</Label>
                          <div className="flex items-center gap-2">
                              <Controller
                                  name="taxType"
                                  control={control}
                                  render={({ field }) => (
                                      <Select onValueChange={field.onChange} value={field.value}>
                                          <SelectTrigger className="w-[120px] h-8">
                                              <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                              <SelectItem value="exclusive">Exclusive</SelectItem>
                                              <SelectItem value="inclusive">Inclusive</SelectItem>
                                          </SelectContent>
                                      </Select>
                                  )}
                              />
                              <div className="flex items-center gap-1">
                                  <Input type="number" className="w-[70px] h-8 text-right" {...register('taxRate', { valueAsNumber: true })} />
                                  <span className="text-sm font-medium">%</span>
                              </div>
                          </div>
                      </div>
                      <div className="flex justify-between items-center">
                          <Label>Tax Amount</Label>
                          <span className="font-medium">{formatCurrency(watch('tax') || 0)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                          <Label className="text-lg font-bold">Total</Label>
                          <span className="font-bold text-lg">{formatCurrency(watch('total') || 0)}</span>
                      </div>
                  </div>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <Label>Notes</Label>
                  <Textarea {...register('notes')} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Draft">Draft</SelectItem>
                              <SelectItem value="Sent">Sent</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                              <SelectItem value="Overdue">Overdue</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                      </Select>
                    )}
                  />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                 <div>
                    <Label>Expense Account (for reporting)</Label>
                    <Controller
                        name="expenseAccountId"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                options={lookups.expenseAccounts}
                                value={field.value || ''}
                                onSelect={(value) => field.onChange(value)}
                                placeholder="Select an expense account"
                            />
                        )}
                    />
                </div>
            </div>
          </div>
          <DialogFooter className="mt-6 pt-4 border-t">
            <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Save Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
