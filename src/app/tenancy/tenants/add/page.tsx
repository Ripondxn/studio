
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  Pencil,
  Loader2,
  Search,
  X,
  FileUp,
  Link2,
  Move,
  Eye
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { saveTenantData, findTenantData, deleteTenantData } from '../actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoiceList } from '../invoice/invoice-list';
import { getInvoicesForCustomer } from '@/app/tenancy/customer/invoice/actions';
import { type Invoice } from '../invoice/schema';
import { Switch } from '@/components/ui/switch';
import { type Tenant, tenantSchema } from '../schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { MoveTenantDialog } from './move-tenant-dialog';
import { handleFileUpload } from '@/app/services/attachment-service';
import { SubscriptionInvoiceDialog } from '../invoice/invoice-dialog';

type Attachment = {
  id: number;
  name: string;
  file: File | null | string;
  url?: string;
  remarks: string;
  isLink: boolean;
};

const initialTenantData: Tenant = {
    code: '',
    name: '',
    mobile: '',
    email: '',
    address: '',
    eid: '',
    occupation: '',
    brokerName: '',
    brokerMobile: '',
    brokerEmail: '',
    brokerCommission: 0,
    contractNo: '',
    property: '',
    unitCode: '',
    roomCode: '',
    isSubscriptionActive: false,
    subscriptionStatus: undefined,
    subscriptionAmount: 0,
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function TenantPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCode, setIsAutoCode] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [savingAttachmentId, setSavingAttachmentId] = useState<number | null>(null);
  const [isSubInvoiceOpen, setIsSubInvoiceOpen] = useState(false);


  const formMethods = useForm<Tenant>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialTenantData,
  });

  const { handleSubmit, watch, reset, getValues } = formMethods;

  const tenantData = watch();
  const tenantCode = watch('code');
  
  const fetchInvoices = useCallback(async (customerCode: string) => {
    if (!customerCode) return;
    setIsLoadingInvoices(true);
    const data = await getInvoicesForCustomer(customerCode);
    setInvoices(data.map(i => ({...i, remainingBalance: i.total - (i.amountPaid || 0)})));
    setIsLoadingInvoices(false);
  }, []);

  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        if (attachment.url) {
          URL.revokeObjectURL(attachment.url);
        }
      });
    };
  }, [attachments]);

  const handleFindClick = useCallback(async (code: string) => {
    try {
      const result = await findTenantData(code);
      if (result.success && result.data) {
        const fullTenantData = { ...initialTenantData, ...(result.data.tenantData || {}) };
        reset(fullTenantData);
        setAttachments(result.data.attachments ? result.data.attachments.map((a: any) => ({
            ...a, 
            name: a.name || '',
            remarks: a.remarks || '',
            file: a.file || null, 
            url: a.file && a.isLink === false && typeof a.file === 'string' && a.file.startsWith('data:') ? a.file : undefined
        })) : []);
        
        if (code !== 'new') {
            setIsNewRecord(false);
            setIsEditing(false);
            setIsAutoCode(false);
            fetchInvoices(result.data.tenantData.code);
        } else {
            setIsNewRecord(true);
            setIsEditing(true);
            setIsAutoCode(true);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Not Found',
          description: `No record found for Tenant Code: ${code}. You can create a new one.`,
        });
        handleFindClick('new');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to find tenant data.',
      });
    }
  }, [reset, toast, fetchInvoices]);

  useEffect(() => {
    const tenantCodeParam = searchParams.get('code');
    if (tenantCodeParam) {
      handleFindClick(tenantCodeParam);
    } else {
      handleFindClick('new');
    }
  }, [searchParams, handleFindClick]);

  
  const handleAttachmentChange = (id: number, field: keyof Attachment, value: any) => {
    setAttachments(prev => prev.map(item => {
        if (item.id === id) {
             if (field === 'file') {
                if (item.url) URL.revokeObjectURL(item.url);
                const newUrl = (value instanceof File) ? URL.createObjectURL(value) : undefined;
                return {...item, file: value, url: newUrl};
            }
             if (field === 'isLink') {
                 if (item.url) URL.revokeObjectURL(item.url);
                 return {...item, isLink: value, file: null, url: undefined };
            }
            return {...item, [field]: value};
        }
        return item;
    }));
  };

  const addAttachmentRow = () => {
    setAttachments(prev => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map(item => item.id)) + 1 : 1,
        name: '',
        file: null,
        remarks: '',
        isLink: false
      }
    ]);
  };

  const removeAttachmentRow = (id: number) => {
    const attachmentToRemove = attachments.find(item => item.id === id);
    if (attachmentToRemove && attachmentToRemove.url) {
        URL.revokeObjectURL(attachmentToRemove.url);
    }
    setAttachments(prev => prev.filter(item => item.id !== id));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  }

  const onSave = async (data: Tenant, isAttachmentSave = false, attachmentId?: number) => {
    if (!isAttachmentSave) setIsSaving(true);
    if (isAttachmentSave && attachmentId) setSavingAttachmentId(attachmentId);

    try {
        const attachmentsToProcess = isAttachmentSave
            ? attachments.filter(a => a.id === attachmentId)
            : attachments;

        const processedAttachments = await Promise.all(
            attachmentsToProcess.map(async (att) => {
                let fileData: string | null = null;
                 if (att.isLink) {
                    fileData = typeof att.file === 'string' ? att.file : null;
                } else if (att.file && att.file instanceof File) {
                    const base64 = await fileToBase64(att.file);
                    fileData = await handleFileUpload(base64, att.file.name);
                } else {
                    fileData = att.file;
                }
                return {
                    id: att.id,
                    name: att.name,
                    file: fileData,
                    remarks: att.remarks,
                    isLink: att.isLink,
                }
            })
        );
        
        let finalAttachments = [...attachments];
        if (isAttachmentSave && processedAttachments.length > 0) {
            finalAttachments = attachments.map(att => {
                const saved = processedAttachments.find(p => p.id === att.id);
                return saved ? { ...att, file: saved.file } : att;
            });
             setAttachments(finalAttachments.map(a => ({...a, url: undefined})));
        }


        const dataToSave = {
            tenantData: data,
            attachments: finalAttachments.map(a => ({...a, file: typeof a.file === 'string' ? a.file : null})),
        };

        const result = await saveTenantData(dataToSave, isNewRecord, isAutoCode);
        if (result.success && result.data) {
            toast({
                title: "Success",
                description: isAttachmentSave ? `Attachment saved.` : `Tenant "${data.name}" saved successfully.`,
            });
            if (!isAttachmentSave) {
                setIsEditing(false);
            }
            if (isNewRecord) {
                router.push(`/tenancy/tenants/add?code=${result.data?.code}`);
            } else {
                 reset(data);
                 if (!isAttachmentSave) {
                    setAttachments(finalAttachments.map(a => ({...a, url: undefined})));
                 }
            }
        } else {
            throw new Error(result.error || 'An unknown error occurred');
        }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message || "Failed to save data.",
      });
    } finally {
        if (!isAttachmentSave) setIsSaving(false);
        if (isAttachmentSave) setSavingAttachmentId(null);
    }
  }

  const onSaveAttachment = (id: number) => {
    handleSubmit((data) => onSave(data, true, id))();
  };

  const handleCancelClick = () => {
     if (isNewRecord) {
        router.push('/tenancy/tenants');
     } else {
        reset();
        setAttachments(getValues().attachments || []);
        setIsEditing(false);
     }
  }

  const handleDelete = async () => {
    const code = getValues('code');
    if (!code) return;
    try {
      const result = await deleteTenantData(code);
      if (result.success) {
        toast({
          title: 'Deleted',
          description: `Tenant "${getValues('name')}" has been deleted.`,
        });
        router.push('/tenancy/tenants');
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to delete tenant data.',
      });
    }
  };
  
  const pageTitle = isNewRecord ? 'Add New Tenant' : `Edit Tenant: ${watch('name')}`;
  
  const handleOpenSubscriptionDialog = () => {
    setIsSubInvoiceOpen(true);
  };


  return (
    <div className="container mx-auto p-4 bg-background">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-primary font-headline">
              {pageTitle}
              </h1>
              <div className="flex items-center gap-2">
                  {!isEditing && !isNewRecord && getValues('contractId') && (
                      <MoveTenantDialog
                          contractId={getValues('contractId')!}
                          currentLocation={{
                              property: getValues('property') || 'N/A',
                              unit: getValues('unitCode') || 'N/A',
                              room: getValues('roomCode'),
                          }}
                      />
                  )}
                  {!isEditing && (
                  <Button type="button" onClick={handleEditClick}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  )}
                  {isEditing && (
                  <>
                      <Button type="submit" disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save
                      </Button>
                      <Button type="button" variant="ghost" onClick={handleCancelClick}>
                      <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                  </>
                  )}
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                      <Button
                          type="button"
                          variant="destructive"
                          disabled={isNewRecord || isEditing}
                      >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Tenant
                      </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          tenant "{getValues('name')}".
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive hover:bg-destructive/90"
                          >
                          Delete
                          </AlertDialogAction>
                      </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                  <Button type="button" variant="outline" onClick={() => router.push('/tenancy/tenants')}>
                      <X className="mr-2 h-4 w-4" /> Close
                  </Button>
              </div>
          </div>
        
          <Tabs defaultValue="info">
            <TabsList>
                <TabsTrigger value="info">Tenant Information</TabsTrigger>
                <TabsTrigger value="subscription" disabled={isNewRecord}>Subscription & Invoices</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
                <Card>
                    <CardHeader>
                    <CardTitle>Tenant Information</CardTitle>
                    <CardDescription>Fill in the details of the tenant.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                               <Label htmlFor="code">Code</Label>
                               <div className="flex items-end gap-2">
                                    <FormControl>
                                        <Input {...field} disabled={isAutoCode || !isNewRecord || !isEditing} />
                                    </FormControl>
                                     <div className="flex items-center space-x-2 pt-6">
                                        <Switch
                                            id="auto-code-switch"
                                            checked={isAutoCode}
                                            onCheckedChange={setIsAutoCode}
                                            disabled={!isNewRecord || !isEditing}
                                        />
                                        <Label htmlFor="auto-code-switch">Auto</Label>
                                    </div>
                               </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                               <Label htmlFor="name">Name</Label>
                               <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="mobile"
                          render={({ field }) => (
                            <FormItem>
                               <Label htmlFor="mobile">Mobile No</Label>
                                <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                               <Label htmlFor="email">Email</Label>
                               <FormControl><Input {...field} type="email" disabled={!isEditing} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                               <Label htmlFor="address">Address</Label>
                               <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="eid"
                          render={({ field }) => (
                            <FormItem>
                               <Label htmlFor="eid">EID/Passport/Visa</Label>
                               <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                               <Label htmlFor="occupation">Occupation</Label>
                               <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                            control={control}
                            name="contractNo"
                            render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="contractNo">Associated Contract No</Label>
                                <FormControl><Input {...field} disabled /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                     <div className="space-y-4 pt-6 border-t">
                        <CardTitle>Attachments</CardTitle>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Attachment Name</TableHead>
                                <TableHead>File / Link</TableHead>
                                <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attachments.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Input 
                                                value={item.name} 
                                                onChange={(e) => handleAttachmentChange(item.id, 'name', e.target.value)} 
                                                disabled={!isEditing} 
                                                placeholder="e.g. Passport Copy"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {item.isLink ? (
                                                    <Input
                                                        type="text"
                                                        placeholder="https://example.com"
                                                        value={typeof item.file === 'string' ? item.file : ''}
                                                        onChange={(e) => handleAttachmentChange(item.id, 'file', e.target.value)}
                                                        disabled={!isEditing}
                                                    />
                                                ) : (
                                                    <Input 
                                                        type="file" 
                                                        className="text-sm w-full" 
                                                        onChange={(e) => handleAttachmentChange(item.id, 'file', e.target.files ? e.target.files[0] : null)}
                                                        disabled={!isEditing}
                                                    />
                                                )}
                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleAttachmentChange(item.id, 'isLink', !item.isLink)} disabled={!isEditing}>
                                                    {item.isLink ? <FileUp className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                             <div className="mt-1">
                                                <a href={getViewLink(item)} target="_blank" className="text-primary hover:underline text-sm" rel="noopener noreferrer">
                                                    View
                                                </a>
                                             </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" type="button" onClick={() => onSaveAttachment(item.id)} disabled={savingAttachmentId === item.id || !isEditing}>
                                                    {savingAttachmentId === item.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4" />}
                                                </Button>
                                                <Button type="button" variant="ghost" size="icon" className="text-destructive" disabled={!isEditing} onClick={() => removeAttachmentRow(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addAttachmentRow} disabled={!isEditing}>
                            <Plus className="mr-2 h-4 w-4"/> Add Attachment
                        </Button>
                    </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="subscription">
                 <InvoiceList
                    tenant={tenantData}
                    invoices={invoices}
                    isLoading={isLoadingInvoices}
                    onRefresh={() => fetchInvoices(tenantCode)}
                    isSubscriptionEditing={isEditing}
                    onCreateInvoice={handleOpenSubscriptionDialog}
                />
            </TabsContent>
          </Tabs>
        </form>
      </FormProvider>
      <SubscriptionInvoiceDialog
        isOpen={isSubInvoiceOpen}
        setIsOpen={setIsSubInvoiceOpen}
        invoice={null}
        tenant={tenantData}
        onSuccess={() => handleFindClick(tenantCode)}
      />
    </div>
  );
}

const getViewLink = (item: Attachment): string => {
    if (item.isLink && typeof item.file === 'string') {
        return item.file;
    }
    if (item.url) { // For new, unsaved file uploads
        return item.url;
    }
    if (typeof item.file === 'string' && (item.file.startsWith('data:') || item.file.startsWith('gdrive:'))) {
         // Note: gdrive links need a special handler to be viewable
        return item.file;
    }
    return '#';
};
```
- usr/src/app/src/app/tenancy/tenants/invoice/invoice-list.tsx:
```tsx

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
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { useFormContext, type Control } from 'react-hook-form';
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
    onCreateInvoice: () => void;
}

export function InvoiceList({ tenant, invoices, isLoading, onRefresh, isSubscriptionEditing, onCreateInvoice }: InvoiceListProps) {
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [paymentDefaultValues, setPaymentDefaultValues] = useState<Partial<Omit<Payment, 'id'>>>();
    const router = useRouter();
    const { formatCurrency } = useCurrency();
    const { control, watch, setValue } = useFormContext<Tenant>();
    
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
                            <Button type="button" variant="outline" onClick={onCreateInvoice}>
                                <Plus className="mr-2 h-4 w-4" /> + Create Subs Invoice
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

```