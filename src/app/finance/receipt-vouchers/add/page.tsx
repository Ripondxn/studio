

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getReceiptVoucherLookups, saveReceiptVoucher } from '../actions';
import { getLookups as getPartyLookups } from '@/app/finance/payment/actions';
import { receiptVoucherSchema } from '../schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, X, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';


type ReceiptVoucherFormData = z.infer<typeof receiptVoucherSchema>;
const formSchema = receiptVoucherSchema.omit({ id: true });

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
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

        form.reset({
            date: format(new Date(), 'yyyy-MM-dd'),
            partyType: 'Tenant',
            paymentMethod: 'Cash',
        });
    }, [form]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not identify current user.' });
            return;
        }

        setIsSaving(true);
        const result = await saveReceiptVoucher({ ...data, createdBy: currentUser.name });

        if (result.success) {
            toast({ title: 'Success', description: 'Receipt voucher created successfully.' });
            router.push('/finance/receipt-vouchers');
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsSaving(false);
    };

    const partyType = form.watch('partyType');
    const paymentMethod = form.watch('paymentMethod');
    const partyOptions = partyType === 'Tenant' ? lookups.tenants : lookups.customers;

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">New Receipt Voucher</h1>
                    <p className="text-muted-foreground">Record a new payment received.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Voucher
                    </Button>
                    <Button variant="outline" onClick={() => router.back()}>
                        <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader><CardTitle>Voucher Details</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField name="receiptNo" control={form.control} render={({ field }) => (
                                    <FormItem><Label>Receipt No.</Label><FormControl><Combobox options={lookups.receiptNumbers} value={field.value || ''} onSelect={field.onChange} placeholder="Select Receipt No." /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="date" control={form.control} render={({ field }) => (
                                    <FormItem><Label>Date</Label><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="collectedBy" control={form.control} render={({ field }) => (
                                    <FormItem><Label>Collected By</Label><FormControl><Combobox options={lookups.collectors} value={field.value || ''} onSelect={field.onChange} placeholder="Select Collector"/></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField name="partyType" control={form.control} render={({ field }) => (
                                    <FormItem><Label>Received From (Type)</Label><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Tenant">Tenant</SelectItem><SelectItem value="Customer">Customer</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField name="partyName" control={form.control} render={({ field }) => (
                                    <FormItem><Label>Party Name</Label><FormControl><Combobox options={partyOptions} value={field.value || ''} onSelect={field.onChange} placeholder="Select Party" disabled={!partyType} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField name="amount" control={form.control} render={({ field }) => (
                                    <FormItem><Label>Amount</Label><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="paymentMethod" control={form.control} render={({ field }) => (
                                    <FormItem><Label>Payment Method</Label><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Cheque">Cheque</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="Card">Card</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )} />
                            </div>
                            {paymentMethod === 'Cheque' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField name="chequeNo" control={form.control} render={({ field }) => (
                                        <FormItem><Label>Cheque No.</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name="chequeDate" control={form.control} render={({ field }) => (
                                        <FormItem><Label>Cheque Date</Label><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name="bankName" control={form.control} render={({ field }) => (
                                        <FormItem><Label>Bank Name</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            )}
                            {(paymentMethod === 'Bank Transfer' || paymentMethod === 'Cheque') && (
                                <div className="space-y-2">
                                    <Label>Deposit to Bank Account</Label>
                                    <FormField name="bankAccountId" control={form.control} render={({ field }) => (
                                         <FormItem>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select Bank" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {lookups.bankAccounts.map(acc => <SelectItem key={acc.value} value={acc.value}>{acc.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                         </FormItem>
                                    )} />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <FormControl>
                                    <Textarea {...form.register('notes')} />
                                </FormControl>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
