

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
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
  Link2
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
import { saveTenantData, findTenantData, deleteTenantData, getTenantLookups, getUnitsForProperty, getRoomsForUnit } from '../actions';
import { getTenantForProperty } from '../../contract/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoiceList } from '@/app/tenancy/tenants/invoice/invoice-list';
import { getInvoicesForCustomer } from '@/app/tenancy/customer/invoice/actions';
import { type Invoice } from '@/app/tenancy/customer/invoice/schema';
import { PaymentReceiptList } from '@/app/tenancy/customer/payment-receipt-list';
import { Switch } from '@/components/ui/switch';
import { type Tenant, tenantSchema } from '../schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox';
import { Separator } from '@/components/ui/separator';
import { MoveTenantDialog } from '../add/move-tenant-dialog';
import type { UserRole } from '@/app/admin/user-roles/schema';

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

type Lookups = {
    properties: {value: string, label: string}[];
    units: {value: string, label: string}[];
    rooms: {value: string, label: string}[];
}

export default function TenantPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCode, setIsAutoCode] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [lookups, setLookups] = useState<Lookups>({ properties: [], units: [], rooms: [] });

  const [isSubscriptionEditing, setIsSubscriptionEditing] = useState(false);


  const form = useForm<Tenant>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialTenantData,
  });

  const tenantCode = form.watch('code');
  const watchedProperty = form.watch('property');
  const watchedUnit = form.watch('unitCode');
  const watchedRoom = form.watch('roomCode');
  const watchedIsSubActive = form.watch('isSubscriptionActive');
  
  const fetchInvoices = useCallback(async (tenantCode: string) => {
    if (!tenantCode) return;
    setIsLoadingInvoices(true);
    const data = await getInvoicesForCustomer(tenantCode);
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
        form.reset(fullTenantData);
        setAttachments(result.data.attachments ? result.data.attachments.map((a: any) => ({...a, file: a.file || null, url: undefined})) : []);
        
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
  }, [form, toast, fetchInvoices]);

  useEffect(() => {
    const tenantCodeParam = searchParams.get('code');
    getTenantLookups().then(data => setLookups(prev => ({...prev, ...data})));
    if (tenantCodeParam) {
      handleFindClick(tenantCodeParam);
    } else {
      handleFindClick('new');
    }
  }, [searchParams, handleFindClick]);

  useEffect(() => {
    const fetchUnits = async () => {
        form.setValue('unitCode', '');
        form.setValue('roomCode', '');
        setLookups(prev => ({...prev, units: [], rooms: []}));
        if(watchedProperty) {
            const unitsData = await getUnitsForProperty(watchedProperty);
            setLookups(prev => ({...prev, units: unitsData}));
        }
    };
    fetchUnits();
  }, [watchedProperty, form]);

   useEffect(() => {
    const fetchRooms = async () => {
        form.setValue('roomCode', '');
        setLookups(prev => ({...prev, rooms: []}));
        if(watchedProperty && watchedUnit) {
            const roomsData = await getRoomsForUnit(watchedProperty, watchedUnit);
            setLookups(prev => ({...prev, rooms: roomsData}));
        }
    };
    fetchRooms();
  }, [watchedProperty, watchedUnit, form]);
  
  const fetchAndSetTenantName = useCallback(async () => {
    if (watchedProperty && watchedUnit) {
      const tenantResult = await getTenantForProperty(watchedProperty, watchedUnit, watchedRoom || undefined);
      if (tenantResult.success && tenantResult.tenantName) {
        form.setValue('name', tenantResult.tenantName);
      } else {
        form.setValue('name', ''); // Clear if no tenant found
      }
    }
  }, [watchedProperty, watchedUnit, watchedRoom, form]);

  useEffect(() => {
    fetchAndSetTenantName();
  }, [fetchAndSetTenantName]);

  
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

  const onSave = async (data: Tenant) => {
    setIsSaving(true);
    try {
      const dataToSave = {
        tenantData: data,
        attachments: attachments.map(a => ({ 
            id: a.id, 
            name: a.name, 
            file: a.file instanceof File ? a.file.name : a.file, 
            remarks: a.remarks,
            isLink: a.isLink 
        })),
      };

      const result = await saveTenantData(dataToSave, isNewRecord, isAutoCode);
      if (result.success && result.data) {
        toast({
          title: "Success",
          description: `Tenant "${data.name}" saved successfully.`,
        });
        setIsEditing(false);
        setIsSubscriptionEditing(false); // Also exit subscription edit mode on main save
        if (isNewRecord) {
            router.push(`/tenancy/tenants/add?code=${result.data?.code}`);
        } else {
            form.reset(data);
        }
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message || "Failed to save tenant data.",
      });
    } finally {
      setIsSaving(false);
    }
  }


  const handleCancelClick = () => {
     if (isNewRecord) {
        router.push('/tenancy/tenants');
     } else {
        form.reset();
        setAttachments(form.getValues().attachments || []);
        setIsEditing(false);
        setIsSubscriptionEditing(false);
     }
  }

  const handleDelete = async () => {
    const code = form.getValues('code');
    if (!code) return;
    try {
      const result = await deleteTenantData(code);
      if (result.success) {
        toast({
          title: 'Deleted',
          description: `Tenant "${form.getValues('name')}" has been deleted.`,
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
  
  const pageTitle = isNewRecord ? 'Add New Tenant' : `Edit Tenant: ${form.watch('name')}`;

  return (
    <div className="container mx-auto p-4 bg-background">
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)}>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-primary font-headline">
            {pageTitle}
            </h1>
            <div className="flex items-center gap-2">
                {!isEditing && (
                <Button type="button" onClick={handleEditClick}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Tenant
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
                        tenant "{form.getValues('name')}".
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
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Tenant Information</CardTitle>
                    <CardDescription>Fill in the details of the tenant.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                        control={form.control}
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
                            control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                            <FormItem>
                            <Label htmlFor="occupation">Occupation</Label>
                            <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                     <Separator className="my-6" />
                     <CardTitle>Current Rented Property</CardTitle>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="property" render={({ field }) => (<FormItem><Label>Property</Label><Combobox options={lookups.properties} value={field.value || ''} onSelect={(value) => {field.onChange(value); form.setValue('unitCode', ''); form.setValue('roomCode','');}} placeholder="Select property" disabled={!isEditing} /><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="unitCode" render={({ field }) => (<FormItem><Label>Unit</Label><Combobox options={lookups.units} value={field.value || ''} onSelect={(value) => {field.onChange(value); form.setValue('roomCode', '');}} placeholder="Select unit" disabled={!isEditing || !watchedProperty} /><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="roomCode" render={({ field }) => (<FormItem><Label>Room (Optional)</Label><Combobox options={lookups.rooms} value={field.value || ''} onSelect={field.onChange} placeholder="Select room" disabled={!isEditing || !watchedUnit} /><FormMessage /></FormItem>)} />
                     </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="subscription">
             <InvoiceList 
                tenant={form.getValues()}
                invoices={invoices}
                isLoading={isLoadingInvoices}
                onRefresh={() => fetchInvoices(form.getValues('code'))}
                isSubscriptionEditing={isSubscriptionEditing}
                setIsSubscriptionEditing={setIsSubscriptionEditing}
                formControl={form.control}
             />
        </TabsContent>
         <TabsContent value="attachments">
            <Card>
                <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
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
                                                    ref={(el) => (fileInputRefs.current[index] = el)}
                                                    onChange={(e) => handleAttachmentChange(item.id, 'file', e.target.files ? e.target.files[0] : null)}
                                                    disabled={!isEditing}
                                                />
                                            )}
                                            <Button type="button" variant="ghost" size="icon" onClick={() => handleAttachmentChange(item.id, 'isLink', !item.isLink)} disabled={!isEditing}>
                                                {item.isLink ? <FileUp className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        {item.url && !item.isLink && (
                                            <Link href={item.url} target="_blank" className="text-primary hover:underline text-sm" rel="noopener noreferrer">
                                                View Uploaded File
                                            </Link>
                                        )}
                                        {item.file && typeof item.file === 'string' && (
                                            item.isLink && item.file.startsWith('http') ? (
                                                <Link href={item.file} target="_blank" className="text-primary hover:underline text-sm" rel="noopener noreferrer">
                                                    Open Link
                                                </Link>
                                            ) : (
                                                !item.isLink && <span className="text-sm text-muted-foreground italic truncate">{item.file}</span>
                                            )
                                        )}
                                    </TableCell>
                                    <TableCell>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive" disabled={!isEditing} onClick={() => removeAttachmentRow(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addAttachmentRow} disabled={!isEditing}>
                        <Plus className="mr-2 h-4 w-4"/> Add Attachment
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      </form>
    </Form>
    </div>
  );
}
