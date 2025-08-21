
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { saveInvoice } from './actions';
import { invoiceSchema, invoiceItemSchema } from './schema';
import { format } from 'date-fns';

const formSchema = invoiceSchema.omit({ id: true });
type InvoiceFormData = z.infer<typeof formSchema>;

interface InvoiceDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  invoice: z.infer<typeof invoiceSchema> | null;
  customer: { code: string; name: string };
  onSuccess: () => void;
}

export function InvoiceDialog({ isOpen, setIsOpen, invoice, customer, onSuccess }: InvoiceDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

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
  const watchedTax = watch('tax');

  useEffect(() => {
    if (!watchedItems) return;
    const subTotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    setValue('subTotal', subTotal);
    setValue('total', subTotal + (watchedTax || 0));
  }, [watchedItems, watchedTax, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (invoice) {
        reset(invoice);
      } else {
        reset({
            invoiceNo: `INV-${Date.now()}`,
            customerCode: customer.code,
            customerName: customer.name,
            invoiceDate: format(new Date(), 'yyyy-MM-dd'),
            dueDate: format(new Date(), 'yyyy-MM-dd'),
            items: [{ id: 'item-1', description: '', quantity: 1, unitPrice: 0, total: 0 }],
            subTotal: 0,
            tax: 0,
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
            <DialogDescription>
              {invoice ? `Editing invoice ${invoice.invoiceNo}` : `Creating a new invoice for ${customer.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
            <div><Label>Invoice #</Label><Input {...register('invoiceNo')} disabled/></div>
            <div><Label>Customer</Label><Input value={customer.name} disabled/></div>
            <div><Label>Invoice Date</Label><Input type="date" {...register('invoiceDate')}/></div>
            <div><Label>Due Date</Label><Input type="date" {...register('dueDate')}/></div>
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
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4} className="text-right">Subtotal</TableCell>
                    <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(watch('subTotal') || 0)}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={3}></TableCell>
                    <TableCell className="text-right">Tax</TableCell>
                    <TableCell><Input type="number" className="text-right" {...register('tax', { valueAsNumber: true })} /></TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(watch('total') || 0)}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableFooter>
          </Table>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 })}>
             <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
          
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

          <DialogFooter className="mt-6">
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
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
