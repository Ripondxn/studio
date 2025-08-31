

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { getLookups, getExpenseAccounts } from '@/app/lookups/actions';
import { getDuesForPayee } from '../../cheque-print/actions';
import { paymentSchema, type Payment } from '../schema';
import { addPayment, getNextPaymentVoucherNumber } from '../actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Save,
  Trash2,
  Plus,
  Loader2,
  X,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { useCurrency } from '@/context/currency-context';

type Lookups = {
    vendors: { value: string, label: string }[];
    landlords: { value: string, label: string }[];
    agents: { value: string, label: string }[];
    bankAccounts: { value: string, label: string }[];
    properties: { value: string; label: string }[];
    units: { value: string; label: string; propertyCode: string }[];
    rooms: { value: string; label: string; propertyCode: string; unitCode?: string }[];
    maintenanceTickets: { value: string; label: string }[];
    expenseAccounts: { value: string; label: string }[];
}

const formSchema = paymentSchema.omit({id: true, currentStatus: true, approvalHistory: true, createdByUser: true});

export default function AddPaymentVoucherPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [lookups, setLookups] = useState<Lookups>({ vendors: [], landlords: [], agents: [], bankAccounts: [], properties: [], units: [], rooms: [], maintenanceTickets: [], expenseAccounts: [] });
    const [isAutoVoucherNo, setIsAutoVoucherNo] = useState(true);
    const [currentUser, setCurrentUser] = useState<{name: string, role: string} | null>(null);
    const { formatCurrency } = useCurrency();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { control, register, handleSubmit, watch, setValue, reset } = form;
    
    useEffect(() => {
        const userProfile = sessionStorage.getItem('userProfile');
        if (userProfile) {
            setCurrentUser(JSON.parse(userProfile));
        }

        const initialize = async () => {
            const [lookupsData, expenseData] = await Promise.all([
                getLookups(),
                getExpenseAccounts()
            ]);
            setLookups(prev => ({...prev, ...lookupsData, expenseAccounts: expenseData}));
            const newVoucherNo = await getNextPaymentVoucherNumber();
            reset({
                type: 'Payment',
                voucherNo: newVoucherNo,
                date: format(new Date(), 'yyyy-MM-dd'),
                partyType: 'Vendor',
                paymentMethod: 'Cash',
                paymentFrom: 'Bank',
                status: 'Paid',
            });
        }
        initialize();
    }, [reset]);

    const partyType = watch('partyType');
    const partyOptions = {
        'Vendor': lookups.vendors,
        'Landlord': lookups.landlords,
        'Agent': lookups.agents,
    }[partyType] || [];
    
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not identify current user.' });
            return;
        }

        setIsSaving(true);
        const result = await addPayment({ ...data, createdByUser: currentUser.name });

        if (result.success) {
            toast({ title: 'Success', description: 'Payment voucher created successfully.' });
            router.push('/finance/payment');
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsSaving(false);
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">New Payment Voucher</h1>
                    <p className="text-muted-foreground">Record a new outgoing payment.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Voucher
                    </Button>
                    <Button variant="outline" onClick={() => router.back()}>
                        <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Voucher Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <FormField name="voucherNo" control={control} render={({field}) => (
                                    <FormItem>
                                        <Label>Voucher No.</Label>
                                        <FormControl><Input {...field} disabled={isAutoVoucherNo}/></FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                 <div className="flex items-end pb-2">
                                    <FormField name="isAutoVoucherNo" control={control} render={({field}) => (
                                        <FormItem className="flex items-center gap-2">
                                            <Switch id="auto-voucher-no" checked={isAutoVoucherNo} onCheckedChange={setIsAutoVoucherNo}/>
                                            <Label htmlFor="auto-voucher-no">Auto-generate</Label>
                                        </FormItem>
                                    )}/>
                                </div>
                                <FormField name="date" control={control} render={({field}) => (
                                    <FormItem>
                                        <Label>Payment Date</Label>
                                        <FormControl><Input type="date" {...field}/></FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                 <FormField name="partyType" control={control} render={({field}) => (
                                    <FormItem>
                                        <Label>Pay To (Party Type)</Label>
                                        <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Vendor">Vendor</SelectItem><SelectItem value="Landlord">Landlord</SelectItem><SelectItem value="Agent">Agent</SelectItem></SelectContent></Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <FormField name="partyName" control={control} render={({field}) => (
                                    <FormItem>
                                        <Label>Party Name</Label>
                                        <Combobox options={partyOptions} value={field.value || ''} onSelect={field.onChange} placeholder="Select Party"/>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <FormField name="amount" control={control} render={({field}) => (
                                    <FormItem>
                                        <Label>Amount</Label>
                                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <FormField name="paymentMethod" control={control} render={({field}) => (
                                    <FormItem>
                                        <Label>Payment Method</Label>
                                        <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Cheque">Cheque</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="Card">Card</SelectItem></SelectContent></Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <FormField name="paymentFrom" control={control} render={({field}) => (
                                    <FormItem>
                                        <Label>Payment Source</Label>
                                         <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Bank">Bank</SelectItem><SelectItem value="Petty Cash">Petty Cash</SelectItem></SelectContent></Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
