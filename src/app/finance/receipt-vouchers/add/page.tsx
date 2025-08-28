

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getReceiptVoucherLookups, saveReceiptVoucherBatch } from '../actions';
import { getLookups as getPartyLookups } from '@/app/finance/payment/actions';
import { receiptVoucherSchema } from '../schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, X, Receipt, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';


const batchFormSchema = z.object({
  vouchers: z.array(receiptVoucherSchema.omit({ id: true, createdBy: true })),
});

type BatchFormData = z.infer<typeof batchFormSchema>;


type Lookups = {
    receiptNumbers: { value: string; label: string }[];
    collectors: { value: string; label: string }[];
    tenants: { value: string, label: string }[];
    customers: { value: string, label: string }[];
    bankAccounts: { value: string, label: string }[];
};

export default function AddReceiptVoucherPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [lookups, setLookups] = useState<Lookups>({ receiptNumbers: [], collectors: [], tenants: [], customers: [], bankAccounts: [] });
    const [currentUser, setCurrentUser] = useState<UserRole | null>(null);

    const form = useForm<BatchFormData>({
        resolver: zodResolver(batchFormSchema),
        defaultValues: {
            vouchers: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "vouchers",
    });

    useEffect(() => {
        const userProfile = sessionStorage.getItem('userProfile');
        if (userProfile) {
            setCurrentUser(JSON.parse(userProfile));
        }

        Promise.all([getReceiptVoucherLookups(), getPartyLookups()]).then(([voucherLookups, partyLookups]) => {
            setLookups({
                ...voucherLookups,
                tenants: partyLookups.tenants,
                customers: partyLookups.customers,
                bankAccounts: partyLookups.bankAccounts
            });
        });
    }, []);
    
    useEffect(() => {
        if(currentUser && fields.length === 0) {
            addVoucherRow();
        }
    }, [currentUser, fields.length]);
    
    const addVoucherRow = () => {
         append({
            receiptNo: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            partyType: 'Tenant',
            partyName: '',
            amount: 0,
            paymentMethod: 'Cash',
            bankAccountId: '',
            chequeNo: '',
            chequeDate: '',
            bankName: '',
            collectedBy: currentUser?.name || '',
            notes: '',
            invoiceId: '',
            contractId: '',
        });
    }

    const onSubmit = async (data: BatchFormData) => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not identify current user.' });
            return;
        }

        setIsSaving(true);
        const result = await saveReceiptVoucherBatch(data, currentUser.name);

        if (result.success) {
            toast({ title: 'Success', description: `${result.count} receipt vouchers created successfully.` });
            router.push('/finance/receipt-vouchers');
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsSaving(false);
    };


    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">New Receipt Voucher Batch</h1>
                    <p className="text-muted-foreground">Record multiple payment receipts at once.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Vouchers
                    </Button>
                    <Button variant="outline" onClick={() => router.back()}>
                        <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader><CardTitle>Receipt Entries</CardTitle></CardHeader>
                        <CardContent>
                             <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-1/12">Receipt #</TableHead>
                                            <TableHead className="w-1/12">Date</TableHead>
                                            <TableHead className="w-1/12">Party</TableHead>
                                            <TableHead className="w-2/12">Party Name</TableHead>
                                            <TableHead className="w-1/12">Amount</TableHead>
                                            <TableHead className="w-1/12">Method</TableHead>
                                            <TableHead className="w-3/12">Details</TableHead>
                                            <TableHead className="w-1/12">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <TableRow key={field.id}>
                                                 <TableCell><FormField name={`vouchers.${index}.receiptNo`} control={form.control} render={({ field }) => ( <Combobox options={lookups.receiptNumbers} value={field.value || ''} onSelect={field.onChange} placeholder="Select..."/>)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.date`} control={form.control} render={({ field }) => ( <Input type="date" {...field} />)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.partyType`} control={form.control} render={({ field }) => ( <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Tenant">Tenant</SelectItem><SelectItem value="Customer">Customer</SelectItem></SelectContent></Select>)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.partyName`} control={form.control} render={({ field }) => (<Combobox options={form.watch(`vouchers.${index}.partyType`) === 'Tenant' ? lookups.tenants : lookups.customers} value={field.value || ''} onSelect={field.onChange} placeholder="Select Party" />)}/></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.amount`} control={form.control} render={({ field }) => ( <Input type="number" {...field} />)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.paymentMethod`} control={form.control} render={({ field }) => ( <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Cheque">Cheque</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="Card">Card</SelectItem></SelectContent></Select>)} /></TableCell>
                                                 <TableCell>
                                                    {form.watch(`vouchers.${index}.paymentMethod`) === 'Cheque' && (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <FormField name={`vouchers.${index}.chequeNo`} control={form.control} render={({ field }) => (<Input placeholder="Cheque #" {...field} />)} />
                                                            <FormField name={`vouchers.${index}.chequeDate`} control={form.control} render={({ field }) => (<Input type="date" {...field} />)} />
                                                            <FormField name={`vouchers.${index}.bankName`} control={form.control} render={({ field }) => (<Input placeholder="Bank" {...field} />)} />
                                                        </div>
                                                    )}
                                                    {(form.watch(`vouchers.${index}.paymentMethod`) === 'Bank Transfer' || form.watch(`vouchers.${index}.paymentMethod`) === 'Card') && (
                                                        <FormField name={`vouchers.${index}.bankAccountId`} control={form.control} render={({ field }) => (<Combobox options={lookups.bankAccounts} value={field.value || ''} onSelect={field.onChange} placeholder="Select Bank" />)} />
                                                    )}
                                                 </TableCell>
                                                 <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             </div>
                             <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addVoucherRow}>
                                <Plus className="mr-2 h-4 w-4" /> Add Row
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
