
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, DollarSign, Edit, Save, X, UserCheck, UserX } from 'lucide-react';
import { columns } from '@/app/tenancy/customer/invoice/columns';
import { DataTable } from '@/app/tenancy/customer/invoice/data-table';
import { type Invoice } from './schema';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { type Payment } from '@/app/finance/payment/schema';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/currency-context';
import { type Tenant } from '../../schema';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cancelSubscription } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { FormField, FormItem, FormControl, FormLabel, useFormContext } from '@/components/ui/form';
import { type Control } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { getContractLookups, getUnitsForProperty, getRoomsForUnit } from '../../contract/actions';
import { Separator } from '@/components/ui/separator';
import { type Room } from '@/app/property/rooms/schema';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type Unit } from '@/app/property/units/schema';
import { SubscriptionInvoiceDialog } from './invoice-dialog';

interface InvoiceListProps {
    tenant: Tenant;
    invoices: Invoice[];
    isLoading: boolean;
    onRefresh: () => void;
    isSubscriptionEditing: boolean;
    control: Control<Tenant>;
    watch: (name: keyof Tenant) => any;
    setValue: (name: keyof Tenant, value: any) => void;
    onCreateInvoice: () => void;
}

export function InvoiceList({ tenant, invoices, isLoading, onRefresh, isSubscriptionEditing, control, watch, setValue, onCreateInvoice }: InvoiceListProps) {
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [paymentDefaultValues, setPaymentDefaultValues] = useState<Partial<Omit<Payment, 'id'>>>();
    const router = useRouter();
    const { formatCurrency } = useCurrency();
    
    const [lookups, setLookups] = useState<{
        properties: { value: string; label: string }[];
        units: (Unit & { value: string; label: string })[];
        rooms: (Room & { value: string; label: string })[];
    }>({ properties: [], units: [], rooms: [] });

    const watchedProperty = watch('property');
    const watchedUnit = watch('unitCode');
    const occupancyStatus = watch('occupancyStatus');

    const fetchLookups = useCallback(async () => {
        const data = await getContractLookups();
        setLookups(prev => ({
            ...prev,
            properties: data.properties || [],
            units: (data.units || []).map(u => ({...u, value: u.unitCode, label: u.unitCode})),
            rooms: (data.rooms || []).map(r => ({...r, value: r.roomCode, label: r.roomCode}))
        }));
    }, []);

    useEffect(() => {
        fetchLookups();
    }, [fetchLookups]);
    
    const filteredUnits = useMemo(() => lookups.units.filter(u => u.propertyCode === watchedProperty && u.occupancyStatus !== 'Occupied'), [lookups.units, watchedProperty]);
    const filteredRooms = useMemo(() => lookups.rooms.filter(r => r.propertyCode === watchedProperty && r.unitCode === watchedUnit && r.occupancyStatus !== 'Occupied'), [lookups.rooms, watchedProperty, watchedUnit]);
    
    const handleEditClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsViewMode(false);
        setIsEditInvoiceOpen(true);
    }
    
    const handleViewClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsViewMode(true);
        setIsEditInvoiceOpen(true);
    }
    
    const handleRecordPayment = (invoice?: Invoice) => {
        const openInvoices = invoice ? [invoice] : invoices.filter(inv => inv.status !== 'Paid' && inv.status !== 'Cancelled');
        
        setPaymentDefaultValues({
            type: 'Receipt',
            partyType: 'Tenant',
            partyName: tenant.code,
            date: format(new Date(), 'yyyy-MM-dd'),
            status: 'Received',
            amount: invoice ? (invoice.remainingBalance || 0) : 0,
            invoiceAllocations: openInvoices.map(i => ({
                invoiceId: i.id,
                amount: i.id === invoice?.id ? (i.remainingBalance || 0) : 0,
            }))
        });
        setIsPaymentDialogOpen(true);
    }

    const handleSuccess = () => {
        onRefresh();
    }
    
    const financialSummary = useMemo(() => {
        return invoices.reduce((acc, inv) => {
            if (inv.status !== 'Cancelled') {
                acc.totalBilled += inv.total;
                acc.totalPaid += inv.amountPaid || 0;
            }
            return acc;
        }, { totalBilled: 0, totalPaid: 0 });
    }, [invoices]);
    
    const [isCancellingSub, setIsCancellingSub] = useState(false);
    const { toast } = useToast();

    const handleCancelSubscription = async () => {
        setIsCancellingSub(true);
        const result = await cancelSubscription(tenant.code);
        if (result.success) {
            toast({ title: "Subscription Cancelled", description: "The tenant's subscription has been removed."});
            onRefresh();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsCancellingSub(false);
    };
    
    const OccupancyStatusBadge = () => {
        if (!occupancyStatus) return null;
        
        const config = {
            'Vacant': { variant: 'default', color: 'bg-green-500/20 text-green-700', icon: <UserCheck className="h-3 w-3" /> },
            'Occupied': { variant: 'destructive', color: 'bg-red-500/20 text-red-700', icon: <UserX className="h-3 w-3" /> },
            'Partially Occupied': { variant: 'secondary', color: 'bg-yellow-500/20 text-yellow-700', icon: <UserX className="h-3 w-3" /> }
        }[occupancyStatus] || { variant: 'secondary', color: '', icon: null };
        
        return <Badge variant={config.variant as any} className={cn('gap-1', config.color, 'border-transparent')}>{config.icon} {occupancyStatus}</Badge>;
    };

    if (!tenant) {
        return <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>Manage invoices for {tenant.name}.</CardDescription>
                    </div>
                </div>
                 <div className="grid grid-cols-3 gap-4 text-center mt-4 border rounded-lg p-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Billed</p>
                        <p className="text-xl font-bold">{formatCurrency(financialSummary.totalBilled)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Paid</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(financialSummary.totalPaid)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Balance Due</p>
                        <p className="text-xl font-bold text-red-600">{formatCurrency(financialSummary.totalBilled - financialSummary.totalPaid)}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Subscription Management</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-2">
                             <FormField
                                control={control}
                                name="isSubscriptionActive"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <Switch
                                            id="isSubscriptionActive"
                                            checked={field.value}
                                            disabled={!isSubscriptionEditing}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked);
                                                if (!checked) {
                                                    setValue('property', '');
                                                    setValue('unitCode', '');
                                                    setValue('roomCode', '');
                                                    setLookups(prev => ({ ...prev, units: [], rooms: [] }));
                                                }
                                            }}
                                        />
                                        <Label htmlFor="isSubscriptionActive" className="!mt-0">
                                            Enable Subscription-Based Tenancy
                                        </Label>
                                    </FormItem>
                                )}
                            />
                             {tenant.isSubscriptionActive && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button type="button" variant="destructive" size="sm" disabled={isCancellingSub || !isSubscriptionEditing}>
                                            {isCancellingSub && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Cancel Subscription
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This will remove the tenant's subscription status and amount. This action cannot be undone.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleCancelSubscription}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={control}
                                name="subscriptionStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subscription Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!watch('isSubscriptionActive') || !isSubscriptionEditing}>
                                            <SelectTrigger><SelectValue placeholder="Select Type"/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yearly">Yearly</SelectItem>
                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={control}
                                name="subscriptionAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subscription Amount</FormLabel>
                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} disabled={!watch('isSubscriptionActive') || !isSubscriptionEditing} />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <Separator />
                         <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-semibold">Assigned Property</h3>
                                <OccupancyStatusBadge />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={control}
                                    name="property"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property</FormLabel>
                                            <Combobox 
                                                options={lookups.properties}
                                                value={field.value || ''}
                                                onSelect={(value) => {
                                                    field.onChange(value);
                                                    setValue('unitCode', '');
                                                    setValue('roomCode','');
                                                }}
                                                placeholder="Select Property"
                                                disabled={!watch('isSubscriptionActive') || !isSubscriptionEditing}
                                            />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="unitCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit</FormLabel>
                                            <Combobox 
                                                options={filteredUnits}
                                                value={field.value || ''}
                                                onSelect={(value) => {
                                                    field.onChange(value);
                                                    setValue('roomCode', '');
                                                }}
                                                placeholder="Select Unit"
                                                disabled={!watch('property') || !isSubscriptionEditing}
                                            />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={control}
                                    name="roomCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Room</FormLabel>
                                            <Combobox 
                                                options={filteredRooms}
                                                value={field.value || ''}
                                                onSelect={field.onChange}
                                                placeholder="Select Room"
                                                disabled={!watch('unitCode') || !isSubscriptionEditing}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <div className="flex items-center gap-2">
                            <Button onClick={() => handleRecordPayment()}>
                                <DollarSign className="mr-2 h-4 w-4" /> Receive Payment
                            </Button>
                            <Button variant="outline" onClick={onCreateInvoice}>
                                <Plus className="mr-2 h-4 w-4" /> Create Invoice
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                <div className="mt-6">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <DataTable columns={columns({ onEdit: handleEditClick, onView: handleViewClick, onRecordPayment: handleRecordPayment })} data={invoices} />
                    )}
                </div>
                
                <AddPaymentDialog
                    isOpen={isPaymentDialogOpen}
                    setIsOpen={setIsPaymentDialogOpen}
                    defaultValues={paymentDefaultValues}
                    customerInvoices={invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled' && (i.remainingBalance || 0) > 0)}
                    onPaymentAdded={handleSuccess}
                />
                 {isEditInvoiceOpen && selectedInvoice && (
                    <SubscriptionInvoiceDialog
                        isOpen={isEditInvoiceOpen}
                        setIsOpen={setIsEditInvoiceOpen}
                        invoice={selectedInvoice}
                        tenant={tenant}
                        onSuccess={handleSuccess}
                        isViewMode={isViewMode}
                    />
                )}
            </CardContent>
        </Card>
    )
}
