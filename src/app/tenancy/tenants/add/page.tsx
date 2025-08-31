
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
import { PaymentReceiptList } from '@/app/tenancy/customer/payment-receipt-list';
import { Switch } from '@/components/ui/switch';
import { type Tenant, tenantSchema, attachmentSchema } from '../schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { MoveTenantDialog } from './move-tenant-dialog';
import { handleFileUpload } from '@/app/services/attachment-service';
import { z } from 'zod';


type Attachment = z.infer<typeof attachmentSchema> & { url?: string };


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
    attachments: [],
};

// Helper function to read a file as a Base64 string on the client
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const TenantAttachments = ({isEditing}: {isEditing: boolean}) => {
    const { control, getValues, setValue } = useFormContext<Tenant>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "attachments"
    });
    
    const [savingAttachmentId, setSavingAttachmentId] = useState<number | null>(null);
    const { toast } = useToast();

    const addAttachmentRow = () => {
        append({
            id: fields.length > 0 ? Math.max(...fields.map(item => item.id)) + 1 : 1,
            name: '',
            file: null,
            remarks: '',
            isLink: false
        });
    };
    
    const removeAttachmentRow = (index: number) => {
        remove(index);
    };

    const handleFileChange = async (index: number, file: File | null) => {
        if (!file) return;

        setSavingAttachmentId(fields[index].id);
        try {
            const base64 = await fileToBase64(file);
            const savedPath = await handleFileUpload(base64, file.name);
            const currentAttachments = getValues('attachments') || [];
            currentAttachments[index].file = savedPath;
            setValue('attachments', currentAttachments, { shouldDirty: true });
            toast({ title: 'Attachment Uploaded', description: 'File is ready to be saved with the tenant.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload the file.' });
        } finally {
            setSavingAttachmentId(null);
        }
    };
    
    return (
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
                        {fields.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`attachments.${index}.name`}
                                        render={({ field }) => (
                                            <Input {...field} disabled={!isEditing} placeholder="e.g. Passport Copy" />
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                         <FormField
                                            control={control}
                                            name={`attachments.${index}.isLink`}
                                            render={({ field }) => (
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={!isEditing}
                                                />
                                            )}
                                        />
                                        {watch(`attachments.${index}.isLink`) ? (
                                            <FormField
                                                control={control}
                                                name={`attachments.${index}.file`}
                                                render={({ field }) => (
                                                    <Input
                                                        type="text"
                                                        placeholder="https://example.com"
                                                        value={typeof field.value === 'string' ? field.value : ''}
                                                        onChange={field.onChange}
                                                        disabled={!isEditing}
                                                    />
                                                )}
                                            />
                                        ) : (
                                            <Input 
                                                type="file" 
                                                className="text-sm w-full" 
                                                onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                                                disabled={!isEditing || savingAttachmentId === item.id}
                                            />
                                        )}
                                         {savingAttachmentId === item.id && <Loader2 className="h-4 w-4 animate-spin" />}
                                    </div>
                                    {item.file && typeof item.file === 'string' && (
                                        item.isLink ? (
                                            <a href={item.file} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">Open Link</a>
                                        ) : (
                                           <span className="text-sm text-muted-foreground italic truncate">File uploaded</span>
                                        )
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive" disabled={!isEditing} onClick={() => removeAttachmentRow(index)}>
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
    )
}


export default function TenantPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCode, setIsAutoCode] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);

  const formMethods = useForm<Tenant>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialTenantData,
  });

  const { control, handleSubmit, watch, setValue, reset, getValues } = formMethods;

  const tenantCode = watch('code');
  const tenantName = watch('name');
  
  const fetchInvoices = useCallback(async (customerCode: string) => {
    if (!customerCode) return;
    setIsLoadingInvoices(true);
    const data = await getInvoicesForCustomer(customerCode);
    setInvoices(data.map(i => ({...i, remainingBalance: i.total - (i.amountPaid || 0)})));
    setIsLoadingInvoices(false);
  }, []);

  const handleFindClick = useCallback(async (code: string) => {
    try {
      const result = await findTenantData(code);
      if (result.success && result.data) {
        const fullTenantData = { ...initialTenantData, ...(result.data.tenantData || {}) };
        
        const attachmentsWithUrls = (result.data.attachments || []).map((a: any) => ({
            id: a.id || Date.now() + Math.random(),
            name: a.name || '',
            remarks: a.remarks || '',
            file: a.file || null,
            isLink: a.isLink || false,
            url: undefined 
        }));
        
        reset({
            ...fullTenantData,
            attachments: attachmentsWithUrls
        });
        
        if (code !== 'new') {
            setIsNewRecord(false);
            setIsEditing(false);
            setIsAutoCode(false);
            if (result.data.tenantData.code) {
                fetchInvoices(result.data.tenantData.code);
            }
        } else {
            setIsNewRecord(true);
            setIsEditing(true);
            setIsAutoCode(true);
            setInvoices([]);
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

  const handleEditClick = () => {
    setIsEditing(true);
  }

  const onSave = async (data: Tenant) => {
    setIsSaving(true);
    try {
      const dataToSave = {
        tenantData: data,
        attachments: data.attachments || [],
      };

      const result = await saveTenantData(dataToSave, isNewRecord, isAutoCode);
      if (result.success && result.data) {
        toast({
          title: "Success",
          description: `Tenant "${data.name}" saved successfully.`,
        });
        setIsEditing(false);
        if (isNewRecord) {
            router.push(`/tenancy/tenants/add?code=${result.data?.code}`);
        } else {
            reset(data);
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
        reset();
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
                    Save Tenant
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
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
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
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="subscription">
            <InvoiceList 
                tenant={getValues()}
                invoices={invoices}
                isLoading={isLoadingInvoices}
                onRefresh={() => fetchInvoices(getValues('code'))}
                isSubscriptionEditing={isEditing}
                setIsSubscriptionEditing={setIsEditing}
                formControl={control}
            />
        </TabsContent>
        <TabsContent value="attachments">
            <TenantAttachments isEditing={isEditing} />
        </TabsContent>
      </Tabs>
      </form>
    </FormProvider>
    </div>
  );
}
