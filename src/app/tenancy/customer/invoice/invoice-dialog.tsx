
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
  TableFooter,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, Printer, X } from 'lucide-react';
import { saveInvoice } from './actions';
import { invoiceSchema, invoiceItemSchema } from './schema';
import { format } from 'date-fns';
import { InvoiceView } from './invoice-view';
import { getContractLookups, getUnitsForProperty } from '../../contract/actions';
import { Combobox } from '@/components/ui/combobox';

const formSchema = invoiceSchema.omit({ id: true });
type InvoiceFormData = z.infer<typeof formSchema>;

interface InvoiceDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  invoice: z.infer<typeof invoiceSchema> | null;
  customer: { code: string; name: string };
  onSuccess: () => void;
  isViewMode?: boolean;
}

export function InvoiceDialog({ isOpen, setIsOpen, invoice, customer, onSuccess, isViewMode = false }: InvoiceDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [lookups, setLookups] = useState<{
    properties: {value: string, label: string}[],
    units: {value: string, label: string}[]
  }>({ properties: [], units: [] });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(formSchema),
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate');
  const watchedTaxType = watch('taxType');
  const watchedProperty = watch('property');

  useEffect(() => {
    getContractLookups().then(data => setLookups(prev => ({...prev, properties: data.properties})));
  }, []);

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
    if (!watchedItems) return;
    const subTotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxRate = watchedTaxRate || 0;
    
    let taxAmount = 0;
    let totalAmount = subTotal;
    let finalSubTotal = subTotal;

    if (watchedTaxType === 'exclusive') {
        taxAmount = subTotal * (taxRate / 100);
        totalAmount = subTotal + taxAmount;
    } else { // inclusive
        taxAmount = subTotal - (subTotal / (1 + (taxRate / 100)));
        finalSubTotal = subTotal - taxAmount;
        totalAmount = subTotal;
    }

    setValue('subTotal', finalSubTotal);
    setValue('tax', taxAmount);
    setValue('total', totalAmount);

  }, [watchedItems, watchedTaxRate, watchedTaxType, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (invoice) {
        reset(invoice);
      } else {
        reset({
            invoiceNo: `INV-${Date.now()}`,
            customerCode: customer.code,
            customerName: customer.name,
            property: '',
            unitCode: '',
            invoiceDate: format(new Date(), 'yyyy-MM-dd'),
            dueDate: format(new Date(), 'yyyy-MM-dd'),
            items: [{ id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 }],
            subTotal: 0,
            tax: 0,
            taxType: 'exclusive',
            taxRate: 0,
            total: 0,
            notes: '',
            status: 'Draft',
        });
      }
    }
  }, [isOpen, invoice, reset, customer]);

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSaving(true);
    const result = await saveInvoice({ ...data, id: invoice?.id });
    if(result.success) {
        toast({ title: 'Success', description: 'Invoice saved successfully.'});
        onSuccess();
        setIsOpen(false);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to save invoice.'});
    }
    setIsSaving(false);
  }

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Invoice</title>');
            // A simple stylesheet for printing
            printWindow.document.write(`
                <style>
                    body { font-family: sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; }
                    th { background-color: #f2f2f2; }
                    .no-print { display: none; }
                </style>
            `);
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }
  }

  if (isViewMode && invoice) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>View Invoice: {invoice.invoiceNo}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto" ref={printRef}>
                    <InvoiceView invoice={invoice} />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <DialogClose asChild><Button type="button">Close</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
            <DialogDescription>
              {invoice ? `Editing invoice ${invoice.invoiceNo}` : `Creating a new invoice for ${customer.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto p-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              <div><Label>Invoice #</Label><Input {...register('invoiceNo')} disabled/></div>
              <div><Label>Customer</Label><Input value={customer.name} disabled/></div>
              <div><Label>Invoice Date</Label><Input type="date" {...register('invoiceDate')}/></div>
              <div><Label>Due Date</Label><Input type="date" {...register('dueDate')}/></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <Label>Property</Label>
                    <Controller
                        name="property"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                options={lookups.properties}
                                value={field.value || ''}
                                onSelect={(value) => {
                                    field.onChange(value);
                                    setValue('unitCode', '');
                                }}
                                placeholder="Select Property"
                            />
                        )}
                    />
                </div>
                 <div>
                    <Label>Unit</Label>
                    <Controller
                        name="unitCode"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                options={lookups.units}
                                value={field.value || ''}
                                onSelect={field.onChange}
                                placeholder="Select Unit"
                                disabled={!watchedProperty}
                            />
                        )}
                    />
                </div>
            </div>

            <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead className="w-1/2">Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {fields.map((field, index) => (
                      <TableRow key={field.id}>
                          <TableCell><Input {...register(`items.${index}.description`)} /></TableCell>
                          <TableCell><Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} /></TableCell>
                          <TableCell><Input type="number" {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} /></TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((watchedItems?.[index]?.quantity || 0) * (watchedItems?.[index]?.unitPrice || 0))}
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
                          <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(watch('subTotal') || 0)}</span>
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
                          <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(watch('tax') || 0)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                          <Label className="text-lg font-bold">Total</Label>
                          <span className="font-bold text-lg">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(watch('total') || 0)}</span>
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
