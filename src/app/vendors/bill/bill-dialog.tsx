

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
import { Plus, Trash2, Loader2, Printer, X } from 'lucide-react';
import { saveBill, getNextBillNumber } from './actions';
import { getLookups } from '@/app/lookups/actions';
import { type Bill, billSchema } from './schema';
import { format } from 'date-fns';
import { BillView } from './bill-view';
import { Combobox } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';
import { useCurrency } from '@/context/currency-context';
import { type Product } from '@/app/products/schema';

const formSchema = billSchema.omit({ id: true, amountPaid: true, remainingBalance: true });
type BillFormData = z.infer<typeof formSchema>;

interface BillDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  bill: z.infer<typeof billSchema> | null;
  vendor: { code: string; name: string };
  onSuccess: () => void;
  isViewMode?: boolean;
}

export function BillDialog({ isOpen, setIsOpen, bill, vendor, onSuccess, isViewMode = false }: BillDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [isPropertyInvoice, setIsPropertyInvoice] = useState(true);
  const [isAutoBillNo, setIsAutoBillNo] = useState(true);
  const { formatCurrency } = useCurrency();

  const [lookups, setLookups] = useState<{
    properties: {value: string, label: string}[],
    units: {value: string, label: string}[],
    rooms: {value: string, label: string}[],
    products: Product[],
    expenseAccounts: {value: string, label: string}[],
    maintenanceTickets: {value: string, label: string}[],
  }>({ properties: [], units: [], rooms: [], products: [], expenseAccounts: [], maintenanceTickets: [] });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BillFormData>({
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
  const watchedUnit = watch('unitCode');

  useEffect(() => {
    getLookups().then(setLookups);
  }, []);

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
    if (!isPropertyInvoice) {
        setValue('property', '');
        setValue('unitCode', '');
        setValue('roomCode', '');
    }
  }, [isPropertyInvoice, setValue]);

  useEffect(() => {
    const initializeForm = async () => {
        if (bill) {
            setIsPropertyInvoice(!!bill.property);
            setIsAutoBillNo(false);
            reset(bill);
        } else {
            const newBillNo = await getNextBillNumber();
            setIsPropertyInvoice(true);
            setIsAutoBillNo(true);
            reset({
                billNo: newBillNo,
                vendorCode: vendor.code,
                vendorName: vendor.name,
                property: '',
                unitCode: '',
                roomCode: '',
                billDate: format(new Date(), 'yyyy-MM-dd'),
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
        }
    };
    if (isOpen) {
      initializeForm();
    }
  }, [isOpen, bill, reset, vendor]);

  const onSubmit = async (data: BillFormData) => {
    setIsSaving(true);
    const result = await saveBill({ ...data, id: bill?.id, isAutoBillNo });
    if(result.success) {
        toast({ title: 'Success', description: 'Bill saved successfully.'});
        onSuccess();
        setIsOpen(false);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to save bill.'});
    }
    setIsSaving(false);
}

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Bill</title>');
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
    const product = lookups.products.find(p => p.itemCode.toLowerCase() === value.toLowerCase() || p.itemName.toLowerCase() === value.toLowerCase());
    if(product) {
        setValue(`items.${index}.description`, product.itemName);
        setValue(`items.${index}.unitPrice`, product.costPrice);
    } else {
        setValue(`items.${index}.description`, label || value);
    }
  }

  if (isViewMode && bill) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>View Bill: {bill.billNo}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto" ref={printRef}>
                    <BillView bill={bill} />
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
            <DialogTitle>{bill ? 'Edit Bill' : 'Create New Bill'}</DialogTitle>
            <DialogDescription>
              {bill ? `Editing bill ${bill.billNo}` : `Creating a new bill for ${vendor.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto p-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              <div><Label>Bill #</Label><Input {...register('billNo')} disabled={isAutoBillNo} /></div>
              <div><Label>Vendor</Label><Input value={vendor.name} disabled/></div>
              <div><Label>Bill Date</Label><Input type="date" {...register('billDate')}/></div>
              <div><Label>Due Date</Label><Input type="date" {...register('dueDate')}/></div>
            </div>
             <div className="flex items-center space-x-2 mb-4">
                <Switch 
                    id="auto-bill-no-switch"
                    checked={isAutoBillNo}
                    onCheckedChange={setIsAutoBillNo}
                    disabled={!!bill} // Disable toggle when editing
                />
                <Label htmlFor="auto-bill-no-switch">Auto-generate Bill No</Label>
            </div>
             <div className="space-y-2 mb-4">
                <Label>VAT / Tax Registration No.</Label>
                <Input {...register('vatRegNo')} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                    <Switch 
                        id="property-invoice-switch" 
                        checked={isPropertyInvoice} 
                        onCheckedChange={setIsPropertyInvoice}
                    />
                    <Label htmlFor="property-invoice-switch">Property-Related Bill</Label>
                </div>
                <div>
                  <Label>Maintenance Ticket</Label>
                  <Controller
                    name="maintenanceTicketId"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        options={lookups.maintenanceTickets || []}
                        value={field.value || ''}
                        onSelect={(value) => field.onChange(value)}
                        placeholder="Link to a ticket"
                      />
                    )}
                  />
                </div>
            </div>
            
            {isPropertyInvoice && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-md bg-muted/50">
                  <div>
                      <Label>Property</Label>
                      <Controller
                          name="property"
                          control={control}
                          render={({ field }) => (
                              <Combobox
                                  options={lookups.properties || []}
                                  value={field.value || ''}
                                  onSelect={(value) => {
                                      field.onChange(value);
                                      setValue('unitCode', '');
                                      setValue('roomCode', '');
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
                                  options={lookups.units || []}
                                  value={field.value || ''}
                                  onSelect={(value) => {
                                      field.onChange(value);
                                      setValue('roomCode', '');
                                  }}
                                  placeholder="Select Unit"
                                  disabled={!watchedProperty}
                              />
                          )}
                      />
                  </div>
                  <div>
                      <Label>Room</Label>
                      <Controller
                          name="roomCode"
                          control={control}
                          render={({ field }) => (
                              <Combobox
                                  options={lookups.rooms || []}
                                  value={field.value || ''}
                                  onSelect={(value) => field.onChange(value)}
                                  placeholder="Select Room"
                                  disabled={!watchedUnit || lookups.rooms.length === 0}
                              />
                          )}
                      />
                  </div>
              </div>
            )}

            <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead className="w-2/5">Item / Description</TableHead>
                      <TableHead>Expense Account</TableHead>
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
                                options={lookups.products.map(p => ({value: p.itemCode, label: p.itemName}))}
                                value={watchedItems?.[index]?.description || ''}
                                onSelect={(value, label) => handleItemSelect(index, value, label)}
                                placeholder="Select or type item..."
                             />
                          </TableCell>
                          <TableCell>
                            <Controller
                                name={`items.${index}.expenseAccountId`}
                                control={control}
                                render={({ field }) => (
                                    <Combobox
                                        options={lookups.expenseAccounts || []}
                                        value={field.value || ''}
                                        onSelect={(value) => field.onChange(value)}
                                        placeholder="Select Account"
                                    />
                                )}
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
          </div>
          <DialogFooter className="mt-6 pt-4 border-t">
            <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Save Bill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

