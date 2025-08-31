

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { getReceiptVoucherLookups, saveReceiptVoucherBatch, getDueAmountForParty } from '../actions';
import { receiptVoucherSchema, type ReceiptVoucher } from '../schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Save, X, FileUp, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { Form, FormControl, FormField, FormMessage } from '@/components/ui/form';
import { type ReceiptBook } from '../../book-management/schema';
import { ImportReceiptsDialog } from '../import-receipts-dialog';
import { useCurrency } from '@/context/currency-context';

const batchFormSchema = z.object({
  vouchers: z.array(receiptVoucherSchema.omit({ id: true, createdBy: true })),
});

type BatchFormData = z.infer<typeof batchFormSchema>;


type Lookups = {
    receipts: { value: string; label: string; book: ReceiptBook }[];
    collectors: { value: string; label: string }[];
    tenants: { value: string; label: string }[];
    customers: { value: string; label: string }[];
    bankAccounts: { value: string; label: string }[];
    properties: {value: string, label: string}[];
    units: {value: string, label: string, propertyCode: string}[];
    rooms: {value: string, label: string, propertyCode: string, unitCode?: string}[];
};

export default function AddReceiptVoucherPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [lookups, setLookups] = useState<Lookups>({ receipts: [], collectors: [], tenants: [], customers: [], bankAccounts: [], properties: [], units: [], rooms: [] });
    const [currentUser, setCurrentUser] = useState<UserRole | null>(null);
    const { formatCurrency } = useCurrency();


    const form = useForm<BatchFormData>({
        resolver: zodResolver(batchFormSchema),
        defaultValues: {
            vouchers: [],
        }
    });

    const { control, watch, setValue } = form;

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "vouchers",
    });

    const watchedVouchers = watch('vouchers');

    useEffect(() => {
        const userProfile = sessionStorage.getItem('userProfile');
        if (userProfile) {
            setCurrentUser(JSON.parse(userProfile));
        }

        getReceiptVoucherLookups().then(setLookups);
    }, []);
    
    useEffect(() => {
        if(currentUser && fields.length === 0) {
            addVoucherRow();
        }
    }, [currentUser, fields.length]);
    
    const addVoucherRow = useCallback(() => {
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
            property: '',
            unitCode: '',
            roomCode: '',
        });
    }, [append, currentUser]);

    const handlePartySelect = async (index: number, partyCode: string, partyType: 'Tenant' | 'Customer') => {
        const partyOptions = partyType === 'Tenant' ? lookups.tenants : lookups.customers;
        const partyName = partyOptions.find(p => p.value === partyCode)?.label || partyCode;

        form.setValue(`vouchers.${index}.partyName`, partyCode);
        form.setValue(`vouchers.${index}.notes`, `Payment from ${partyName}`);
        
        const result = await getDueAmountForParty(partyType, partyCode);
        form.setValue(`vouchers.${index}.amount`, result.totalDue);
        if (result.property) form.setValue(`vouchers.${index}.property`, result.property);
        if (result.unitCode) form.setValue(`vouchers.${index}.unitCode`, result.unitCode);
        if (result.roomCode) form.setValue(`vouchers.${index}.roomCode`, result.roomCode);
    }
    
    const handleReceiptSelect = (index: number, receiptNo: string) => {
        form.setValue(`vouchers.${index}.receiptNo`, receiptNo);
        const selectedReceipt = lookups.receipts.find(r => r.value === receiptNo);
        const currentCollector = form.getValues(`vouchers.${index}.collectedBy`);
        if(selectedReceipt?.book?.assignedTo) {
            form.setValue(`vouchers.${index}.collectedBy`, selectedReceipt.book.assignedTo);
        }
        form.setValue(`vouchers.${index}.notes`, `Payment received via Receipt Voucher #${receiptNo}. Collected by ${form.getValues(`vouchers.${index}.collectedBy`)}.`);
    }
    
    const handleDataImport = (data: any[]) => {
        const transformedData = data.map(row => ({
            ...row,
            partyType: row.partyType || 'Tenant',
            date: row.date ? format(new Date(row.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            amount: parseFloat(row.amount) || 0,
            paymentMethod: row.paymentMethod || 'Cash',
            collectedBy: row.collectedBy || currentUser?.name || '',
        }));
        replace(transformedData);
        toast({ title: "Import Successful", description: `${data.length} rows have been loaded into the form.`});
    };

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
    
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Receipt Voucher Batch", 14, 16);
        (doc as any).autoTable({
            head: [['Date', 'Party', 'Receipt #', 'Amount', 'Method', 'Collector']],
            body: form.getValues('vouchers').map(v => [
                v.date,
                v.partyName,
                v.receiptNo,
                formatCurrency(v.amount),
                v.paymentMethod,
                v.collectedBy
            ]),
            startY: 20,
        });
        doc.save(`receipt-batch-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    };

    const handleExportExcel = () => {
        const dataToExport = form.getValues('vouchers').map(v => ({
            'ReceiptNo': v.receiptNo,
            'Date': v.date,
            'PartyType': v.partyType,
            'PartyName': v.partyName,
            'Property': v.property,
            'Unit': v.unitCode,
            'Room': v.roomCode,
            'Amount': v.amount,
            'PaymentMethod': v.paymentMethod,
            'CollectedBy': v.collectedBy,
            'Notes': v.notes,
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Receipt Vouchers");
        XLSX.writeFile(wb, `receipt-batch-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    };


    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">New Receipt Voucher Batch</h1>
                    <p className="text-muted-foreground">Record multiple payment receipts at once.</p>
                </div>
                <div className="flex items-center gap-2">
                     <ImportReceiptsDialog onDataImport={handleDataImport} />
                     <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4"/>PDF</Button>
                     <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4"/>Excel</Button>
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
                                            <TableHead className="w-[12%]">Receipt #</TableHead>
                                            <TableHead className="w-[10%]">Date</TableHead>
                                            <TableHead className="w-[10%]">Party Type</TableHead>
                                            <TableHead className="w-[15%]">Party Name</TableHead>
                                            <TableHead className="w-[10%]">Property</TableHead>
                                            <TableHead className="w-[8%]">Unit</TableHead>
                                            <TableHead className="w-[8%]">Room</TableHead>
                                            <TableHead className="w-[8%] text-right">Amount</TableHead>
                                            <TableHead className="w-[10%]">Method</TableHead>
                                            <TableHead className="w-[10%]">Collector</TableHead>
                                            <TableHead className="w-[15%]">Details</TableHead>
                                            <TableHead className="w-[5%]">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <TableRow key={field.id}>
                                                 <TableCell><FormField name={`vouchers.${index}.receiptNo`} control={form.control} render={({ field }) => ( <Combobox options={lookups.receipts} value={field.value || ''} onSelect={(value) => handleReceiptSelect(index, value)} placeholder="Select..."/>)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.date`} control={form.control} render={({ field }) => ( <Input type="date" {...field} />)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.partyType`} control={form.control} render={({ field }) => ( <Select onValueChange={(value) => { field.onChange(value); form.setValue(`vouchers.${index}.partyName`, ''); }} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Tenant">Tenant</SelectItem><SelectItem value="Customer">Customer</SelectItem></SelectContent></Select>)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.partyName`} control={form.control} render={({ field }) => (<Combobox options={form.watch(`vouchers.${index}.partyType`) === 'Tenant' ? lookups.tenants : lookups.customers} value={field.value || ''} onSelect={(value) => handlePartySelect(index, value, form.watch(`vouchers.${index}.partyType`))} placeholder="Select Party" />)}/></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.property`} control={form.control} render={({ field }) => (<Combobox options={lookups.properties} value={field.value || ''} onSelect={(value) => {field.onChange(value); form.setValue(`vouchers.${index}.unitCode`, ''); form.setValue(`vouchers.${index}.roomCode`,'');}} placeholder="Property" />)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.unitCode`} control={form.control} render={({ field }) => (<Combobox options={lookups.units.filter(u => u.propertyCode === watch(`vouchers.${index}.property`))} value={field.value || ''} onSelect={(value) => {field.onChange(value); form.setValue(`vouchers.${index}.roomCode`, '');}} placeholder="Unit" disabled={!watch(`vouchers.${index}.property`)} />)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.roomCode`} control={form.control} render={({ field }) => (<Combobox options={lookups.rooms.filter(r => r.propertyCode === watch(`vouchers.${index}.property`) && r.unitCode === watch(`vouchers.${index}.unitCode`))} value={field.value || ''} onSelect={field.onChange} placeholder="Room" disabled={!watch(`vouchers.${index}.unitCode`)} />)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.amount`} control={form.control} render={({ field }) => ( <Input type="number" {...field} className="text-right" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.paymentMethod`} control={form.control} render={({ field }) => ( <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Cheque">Cheque</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="Card">Card</SelectItem></SelectContent></Select>)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.collectedBy`} control={form.control} render={({ field }) => ( <Combobox options={lookups.collectors} value={field.value || ''} onSelect={field.onChange} placeholder="Collector..."/>)} /></TableCell>
                                                 <TableCell><FormField name={`vouchers.${index}.notes`} control={form.control} render={({ field }) => ( <Input placeholder="Notes..." {...field} />)} /></TableCell>
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
