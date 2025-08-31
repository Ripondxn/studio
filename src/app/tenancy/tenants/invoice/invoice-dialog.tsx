

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
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, Printer, X } from 'lucide-react';
import { saveSubscriptionInvoice, getNextSubscriptionInvoiceNumber } from './actions';
import { getLookups } from '@/app/lookups/actions';
import { type Invoice, subscriptionInvoiceSchema } from './schema';
import { format } from 'date-fns';
import { InvoiceView } from '@/app/tenancy/customer/invoice/invoice-view';
import { Switch } from '@/components/ui/switch';
import { useCurrency } from '@/context/currency-context';
import { type Product } from '@/app/products/schema';
import { Combobox } from '@/components/ui/combobox';

type InvoiceFormData = z.infer<typeof subscriptionInvoiceSchema>;

interface SubscriptionInvoiceDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  invoice: Invoice | null;
  tenant: { code: string; name: string, isSubscriptionActive?: boolean, subscriptionStatus?: 'Yearly' | 'Monthly', subscriptionAmount?: number, property?: string, unitCode?: string, roomCode?: string };
  onSuccess: () => void;
  isViewMode?: boolean;
}

export function SubscriptionInvoiceDialog({ isOpen, setIsOpen, invoice, tenant, onSuccess, isViewMode = false }: SubscriptionInvoiceDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [isAutoInvoiceNo, setIsAutoInvoiceNo] = useState(true);
  const { formatCurrency } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(subscriptionInvoiceSchema),
  });
  
  const { control, register, handleSubmit, reset, watch, setValue } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch('items');

  useEffect(() => {
    if (!watchedItems) return;
    const subTotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    setValue('subTotal', subTotal);
    setValue('total', subTotal);
    setValue('tax', 0);
  }, [watchedItems, setValue]);
  

  useEffect(() => {
    const initializeForm = async () => {
        if (!tenant) return;

        if (invoice) { // Editing existing invoice
            setIsAutoInvoiceNo(false);
            reset(invoice);
        } else { // Creating new invoice
            const newInvoiceNo = await getNextSubscriptionInvoiceNumber();
            setIsAutoInvoiceNo(true);
            reset({
                invoiceNo: newInvoiceNo,
                customerCode: tenant.code,
                customerName: tenant.name,
                property: tenant.property || '',
                unitCode: tenant.unitCode || '',
                roomCode: tenant.roomCode || '',
                invoiceDate: format(new Date(), 'yyyy-MM-dd'),
                dueDate: format(new Date(), 'yyyy-MM-dd'),
                items: [{ id: `item-${Date.now()}`, description: `${tenant.subscriptionStatus || 'Monthly'} Subscription`, quantity: 1, unitPrice: tenant.subscriptionAmount || 0, total: tenant.subscriptionAmount || 0 }],
                subTotal: tenant.subscriptionAmount || 0,
                tax: 0,
                total: tenant.subscriptionAmount || 0,
                notes: '',
                status: 'Draft',
            });
        }
    };
    if (isOpen) {
      getLookups().then(data => {
        setProducts(data.products || []);
      });
      initializeForm();
    }
  }, [isOpen, invoice, reset, tenant]);

  const onSubmit = async (data: InvoiceFormData) => {
    const userProfile = sessionStorage.getItem('userProfile');
    if(!userProfile) {
        toast({variant: 'destructive', title: 'Error', description: 'Could not identify current user.'});
        return;
    }
    const currentUser = JSON.parse(userProfile);

    setIsSaving(true);
    const result = await saveSubscriptionInvoice({ ...data, id: invoice?.id, isAutoInvoiceNo }, currentUser.name);
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
            printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f2f2f2; } .no-print { display: none; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }
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
      <DialogContent className="sm:max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{invoice ? 'Edit' : 'Create'} Subscription Invoice</DialogTitle>
            <DialogDescription>
              {invoice ? `Editing invoice ${invoice.invoiceNo}` : `Creating a new invoice for ${tenant.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto p-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              <div><Label>Invoice #</Label><Input {...register('invoiceNo')} disabled={isAutoInvoiceNo} /></div>
              <div><Label>Tenant</Label><Input value={tenant.name} disabled/></div>
              <div><Label>Invoice Date</Label><Input type="date" {...register('invoiceDate')}/></div>
              <div><Label>Due Date</Label><Input type="date" {...register('dueDate')}/></div>
            </div>
             <div className="flex items-center space-x-2 mb-4">
                <Switch 
                    id="auto-invoice-no-switch"
                    checked={isAutoInvoiceNo}
                    onCheckedChange={setIsAutoInvoiceNo}
                    disabled={!!invoice}
                />
                <Label htmlFor="auto-invoice-no-switch">Auto-generate Invoice No</Label>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <div>
                    <Label>Property</Label>
                     <Input {...register('property')} disabled />
                </div>
                <div>
                    <Label>Unit</Label>
                    <Input {...register('unitCode')} disabled />
                </div>
                <div>
                    <Label>Room</Label>
                    <Input {...register('roomCode')} disabled />
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
                  <div className="w-full max-w-xs space-y-2">
                      <div className="flex justify-between border-t pt-2 mt-2">
                          <Label className="text-lg font-bold">Total</Label>
                          <span className="font-bold text-lg">{formatCurrency(watch('total') || 0)}</span>
                      </div>
                  </div>
              </div>
            
            <div className="space-y-2 mt-6">
                <Label>Notes</Label>
                <Textarea {...register('notes')} />
            </div>
          </div>
          <DialogFooter className="mt-6 pt-4 border-t">
            <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {invoice ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
