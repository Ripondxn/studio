
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

const chequePrintSchema = z.object({
  payee: z.string().min(1, 'Payee is required.'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than zero.'),
  date: z.string(),
  memo: z.string().optional(),
  bankName: z.string().optional(),
  branch: z.string().optional(),
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

export function ChequePrintClient() {
  const printRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<ChequePrintFormData>({
    resolver: zodResolver(chequePrintSchema),
    defaultValues: {
      payee: '',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      memo: '',
      bankName: '',
      branch: '',
    },
  });

  const watchedAmount = form.watch('amount');
  const amountInWords = watchedAmount > 0 ? toWords.convert(watchedAmount) : '';
  const formattedDate = format(new Date(form.watch('date') || new Date()), 'ddMMyyyy').split('').join(' ');

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
        amount: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        memo: '',
        bankName: '',
        branch: ''
      });
  }

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Cheque Printing</CardTitle>
          <CardDescription>
            Fill in the details below to generate a printable cheque.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                    <Label htmlFor="payee">Pay to the Order of</Label>
                    <Input id="payee" {...form.register('payee')} placeholder="Enter payee name"/>
                    {form.formState.errors.payee && <p className="text-destructive text-sm">{form.formState.errors.payee.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" {...form.register('amount')} />
                     {form.formState.errors.amount && <p className="text-destructive text-sm">{form.formState.errors.amount.message}</p>}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" {...form.register('date')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="memo">Memo</Label>
                    <Input id="memo" {...form.register('memo')} />
                </div>
            </div>
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
                <div className="payee">{form.getValues('payee')}</div>
                <div className="amount-words">{amountInWords}</div>
                <div className="amount-box">**{form.getValues('amount').toLocaleString('en-US', {minimumFractionDigits: 2})}**</div>
                <div className="memo">{form.getValues('memo')}</div>
            </div>
        </div>
      </div>
    </>
  );
}
