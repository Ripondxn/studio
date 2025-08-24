
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, X } from 'lucide-react';
import { format } from 'date-fns';
import { ToWords } from 'to-words';
import { getPaymentLookups } from '../payment/actions';
import { getDuesForPayee } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const chequePrintSchema = z.object({
  payee: z.string().optional(),
  customPayee: z.string().optional(),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than zero.'),
  date: z.string(),
  memo: z.string().optional(),
  bankName: z.string().optional(),
  branch: z.string().optional(),
}).refine(data => data.payee || data.customPayee, {
    message: 'Either select an existing payee or enter a custom one.',
    path: ['payee'],
});

type ChequePrintFormData = z.infer<typeof chequePrintSchema>;

const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  }
});

type Lookups = {
    tenants: { value: string, label: string }[];
    landlords: { value: string, label: string }[];
    vendors: { value: string, label: string }[];
    customers: { value: string, label: string }[];
}

type DueItem = {
    label: string;
    value: number;
    reference: string;
}

export function ChequePrintClient() {
  const printRef = useRef<HTMLDivElement>(null);
  const [lookups, setLookups] = useState<Lookups>({ tenants: [], landlords: [], vendors: [], customers: [] });
  const [dueItems, setDueItems] = useState<DueItem[]>([]);
  const [isLoadingDues, setIsLoadingDues] = useState(false);
  
  const form = useForm<ChequePrintFormData>({
    resolver: zodResolver(chequePrintSchema),
    defaultValues: {
      payee: '',
      customPayee: '',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      memo: '',
      bankName: '',
      branch: '',
    },
  });

  useEffect(() => {
    getPaymentLookups().then(data => setLookups(data));
  }, []);

  const payeeOptions = [
      ...lookups.tenants,
      ...lookups.landlords,
      ...lookups.vendors,
      ...lookups.customers
  ];
  
  const watchedPayee = form.watch('payee');
  
  useEffect(() => {
    if (watchedPayee) {
        setIsLoadingDues(true);
        getDuesForPayee(watchedPayee)
            .then(items => {
                setDueItems(items);
                setIsLoadingDues(false);
            });
    } else {
        setDueItems([]);
    }
  }, [watchedPayee]);

  const handleDueItemSelect = (value: string) => {
    const selectedDue = dueItems.find(item => item.reference === value);
    if(selectedDue) {
        form.setValue('amount', selectedDue.value);
        form.setValue('memo', `Payment for ${selectedDue.reference}`);
    }
  }

  const watchedAmount = form.watch('amount');
  const amountInWords = watchedAmount > 0 ? toWords.convert(watchedAmount) : '';
  const formattedDate = format(new Date(form.watch('date') || new Date()), 'ddMMyyyy').split('').join(' ');
  
  const getPayeeName = () => {
    const customPayee = form.getValues('customPayee');
    if (customPayee) return customPayee;
    
    const selectedPayeeCode = form.getValues('payee');
    return payeeOptions.find(p => p.value === selectedPayeeCode)?.label || '';
  }


  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const printWindow = window.open('', '', 'height=400,width=800');
      if(printWindow) {
        printWindow.document.write('<html><head><title>Print Cheque</title>');
        printWindow.document.write('<style>@page { size: 210mm 99mm; margin: 0; } body { margin: 0; font-family: "Courier New", monospace; color: black; } .cheque { position: relative; width: 210mm; height: 99mm; } .bank-name { position: absolute; top: 10mm; left: 15mm; font-size: 10pt; font-weight: bold; } .branch { position: absolute; top: 18mm; left: 15mm; font-size: 8pt; } .date { position: absolute; top: 18mm; right: 15mm; letter-spacing: 4mm; font-size: 10pt; } .payee { position: absolute; top: 35mm; left: 25mm; font-size: 10pt; font-weight: bold; } .amount-words { position: absolute; top: 45mm; left: 25mm; font-size: 10pt; } .amount-box { position: absolute; top: 45mm; right: 15mm; font-size: 10pt; font-weight: bold; } .memo { position: absolute; top: 55mm; left: 25mm; font-size: 8pt; } </style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleClear = () => {
      form.reset({
        payee: '',
        customPayee: '',
        amount: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        memo: '',
        bankName: '',
        branch: ''
      });
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Cheque Printing</CardTitle>
          <CardDescription>
            Fill in the details below to generate a printable cheque. You can select an existing payee or enter a custom name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                    <Label htmlFor="payee">Select Existing Payee (Optional)</Label>
                    <Controller
                        name="payee"
                        control={form.control}
                        render={({ field }) => (
                            <Combobox
                                options={payeeOptions}
                                value={field.value || ''}
                                onSelect={(value) => {
                                    field.onChange(value);
                                    form.setValue('customPayee', ''); // Clear custom payee when selecting from list
                                }}
                                placeholder="Select from existing list..."
                            />
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="customPayee">Or Enter Custom Payee Name</Label>
                    <Input id="customPayee" {...form.register('customPayee')} placeholder="e.g. John Doe"/>
                </div>
             </div>
             {isLoadingDues ? <p className="text-sm text-muted-foreground">Loading due payments...</p> : dueItems.length > 0 && (
                <div className="space-y-2">
                    <Label>Select Due Amount (Optional)</Label>
                     <Select onValueChange={handleDueItemSelect}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a due payment to auto-fill amount"/>
                        </SelectTrigger>
                        <SelectContent>
                            {dueItems.map(item => (
                                <SelectItem key={item.reference} value={item.reference}>{item.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
             )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" {...form.register('amount')} />
                     {form.formState.errors.amount && <p className="text-destructive text-sm">{form.formState.errors.amount.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" {...form.register('date')} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" {...form.register('bankName')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input id="branch" {...form.register('branch')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="memo">Memo / For</Label>
                <Input id="memo" {...form.register('memo')} />
            </div>
            {form.formState.errors.payee && <p className="text-destructive text-sm">{form.formState.errors.payee.message}</p>}
            <div className="pt-8 flex justify-end gap-2">
                 <Button type="button" variant="outline" onClick={handleClear}>
                    <X className="mr-2 h-4 w-4"/>
                    Clear
                </Button>
                <Button type="button" onClick={form.handleSubmit(handlePrint)}>
                    <Printer className="mr-2 h-4 w-4"/>
                    Print Cheque
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="hidden">
        <div ref={printRef}>
            <div className="cheque">
                <div className="bank-name">{form.getValues('bankName')}</div>
                <div className="branch">{form.getValues('branch')}</div>
                <div className="date">{formattedDate}</div>
                <div className="payee">{getPayeeName()}</div>
                <div className="amount-words">{amountInWords}</div>
                <div className="amount-box">**{form.getValues('amount').toLocaleString('en-US', {minimumFractionDigits: 2})}**</div>
                <div className="memo">{form.getValues('memo')}</div>
            </div>
        </div>
      </div>
    </>
  );
}
