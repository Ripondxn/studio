

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  Home,
  FileText,
  DollarSign,
  Calendar,
  BedDouble,
  DoorOpen,
  Move,
  Printer
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
import { getContractLookups, getUnitsForProperty, getRoomsForUnit, getRoomDetails, moveTenant, getLatestContractForTenant, getUnitDetails } from '../../contract/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Contract, type PaymentInstallment } from '../../contract/schema';
import { type Unit } from '@/app/property/units/schema';
import { type Room } from '@/app/property/rooms/schema';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MoveTenantDialog } from './move-tenant-dialog';
import type { UserRole } from '@/app/admin/user-roles/schema';
import { Combobox } from '@/components/ui/combobox';
import { InvoiceList } from '../invoice/invoice-list';
import { type Invoice } from '../invoice/schema';
import { getInvoicesForTenant } from '../invoice/actions';
import { type Tenant, tenantSchema } from '../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

type Attachment = {
  id: number;
  name: string;
  file: File | null | string;
  url?: string;
  remarks: string;
  isLink: boolean;
};

type Lookups = {
    properties: {value: string, label: string}[];
    units: {value: string, label: string}[];
    rooms: {value: string, label: string}[];
    tenants: any[];
}


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
    securityDepositAmount: 0,
    securityDepositStatus: 'unpaid',
    securityDepositReturnDate: '',
    securityDepositReturnedAmount: 0,
    securityDepositRemarks: '',
    property: '',
    unitCode: '',
    roomCode: '',
    subscriptionStatus: undefined,
    subscriptionAmount: 0,
};

export default function TenantPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAutoCode, setIsAutoCode] = useState(true);
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [contractData, setContractData] = useState<Partial<Contract>>({});
  const [unitData, setUnitData] = useState<Partial<Unit & { property?: any }>>({});
  const [roomData, setRoomData] = useState<Partial<Room>>({});
  
  const [lookups, setLookups] = useState<Lookups>({ properties: [], units: [], rooms: [], tenants: [] });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  
  const form = useForm<Tenant>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialTenantData,
  });

  const fetchInvoices = useCallback(async (tenantCode: string) => {
    if (!tenantCode) return;
    setIsLoadingInvoices(true);
    const data = await getInvoicesForTenant(tenantCode);
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
    setIsFinding(true);
    try {
      const result = await findTenantData(code);
      if (result.success && result.data) {
        const fullTenantData = { ...initialTenantData, ...(result.data.tenantData || {}) };
        form.reset(fullTenantData);
        setAttachments(result.data.attachments ? result.data.attachments.map((a: any) => ({...a, file: a.file || null, url: undefined})) : []);
        setContractData(result.data.contractData || {});
        setUnitData(result.data.unitData || {});
        setRoomData(result.data.roomData || {});

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
    } finally {
      setIsFinding(false);
    }
  }, [form, toast, fetchInvoices]);


  useEffect(() => {
    getContractLookups().then(data => {
        setLookups(prev => ({...prev, properties: data.properties, tenants: data.tenants}));
    });
    const tenantCode = searchParams.get('code');
    if (tenantCode) {
      setIsNewRecord(false);
      handleFindClick(tenantCode);
    } else {
        setIsNewRecord(true);
        setIsEditing(true); 
        handleFindClick('new');
    }
  }, [searchParams, handleFindClick]);
  
  const watchedProperty = form.watch('property');
  const watchedUnit = form.watch('unitCode');

  useEffect(() => {
    const fetchUnits = async () => {
        if (watchedProperty) {
            const unitsData = await getUnitsForProperty(watchedProperty);
            setLookups(prev => ({...prev, units: unitsData, rooms: []}));
        }
    }
    fetchUnits();
  }, [watchedProperty]);

  useEffect(() => {
    const fetchRooms = async () => {
        if (watchedProperty && watchedUnit) {
            const roomsData = await getRoomsForUnit(watchedProperty, watchedUnit);
            setLookups(prev => ({...prev, rooms: roomsData}));
        }
    }
    fetchRooms();
  }, [watchedProperty, watchedUnit]);


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

  const onSave = async (formData: Tenant) => {
    setIsSaving(true);
    try {
      const dataToSave = {
        tenantData: formData,
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
          description: `Tenant "${formData.name}" saved successfully.`,
        });
        setIsEditing(false);
        if (isNewRecord) {
            router.push(`/tenancy/tenants/add?code=${result.data?.code}`);
        } else {
            form.reset(formData);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)}>
        <div className="container mx-auto p-4 bg-background">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary font-headline">
                {pageTitle}
                </h1>
                <div className="flex items-center gap-2">
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
                    <TabsTrigger value="rental-details" disabled={isNewRecord}>Rental Details</TabsTrigger>
                    <TabsTrigger value="security-deposit">Security Deposit</TabsTrigger>
                    <TabsTrigger value="subscription-invoice" disabled={isNewRecord}>Subscription Invoice</TabsTrigger>
                    <TabsTrigger value="pdc" disabled={isNewRecord}>PDC Schedule</TabsTrigger>
                    <TabsTrigger value="termination" disabled={isNewRecord}>Termination</TabsTrigger>
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
                                        <Button type="button" variant="outline" size="icon" onClick={() => handleFindClick(field.value)} disabled={!isEditing || isNewRecord}>
                                            {isFinding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <div>
                                    <div className="flex items-center space-x-2 pt-6">
                                        <Switch
                                            id="auto-code-switch"
                                            checked={isAutoCode}
                                            onCheckedChange={setIsAutoCode}
                                            disabled={!isNewRecord || !isEditing}
                                        />
                                        <Label htmlFor="auto-code-switch">Auto-generate Code</Label>
                                    </div>
                                </div>
                                <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
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
                                
                                <FormField
                                    control={form.control}
                                    name="contractNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="contractNo">Tenancy Contract No</Label>
                                            {contractData.id ? (
                                            <Button asChild variant="link" className="p-0 h-auto font-normal block truncate">
                                                <Link href={`/tenancy/contract?id=${contractData.id}`}>{field.value}</Link>
                                            </Button>
                                            ) : (
                                            <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                                            )}
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                                <FormField control={form.control} name="property" render={({ field }) => (<FormItem><Label>Property</Label><Combobox options={lookups.properties} {...field} onSelect={(value) => { field.onChange(value); form.setValue('unitCode', ''); form.setValue('roomCode','');}} placeholder="Select property" disabled={!isEditing} /><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="unitCode" render={({ field }) => (<FormItem><Label>Unit</Label><Combobox options={lookups.units} {...field} onSelect={(value) => { field.onChange(value); form.setValue('roomCode', '');}} placeholder="Select unit" disabled={!isEditing || !watchedProperty} /><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="roomCode" render={({ field }) => (<FormItem><Label>Room</Label><Combobox options={lookups.rooms} {...field} onSelect={field.onChange} placeholder="Select room" disabled={!isEditing || !watchedUnit} /><FormMessage /></FormItem>)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                <FormField control={form.control} name="subscriptionStatus" render={({ field }) => (<FormItem><Label>Subscription Status</Label><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="Select Subscription Status"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Yearly">Yearly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="subscriptionAmount" render={({ field }) => (<FormItem><Label>Subscription Amount</Label><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} disabled={!isEditing}/></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Broker / Agent Reference</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <FormField control={form.control} name="brokerName" render={({ field }) => (<FormItem><Label>Broker Name</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="brokerMobile" render={({ field }) => (<FormItem><Label>Broker Mobile</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="brokerEmail" render={({ field }) => (<FormItem><Label>Broker Email</Label><FormControl><Input type="email" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="brokerCommission" render={({ field }) => (<FormItem><Label>Commission Amount</Label><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
                                </CardContent>
                            </Card>
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
                        </div>
                    </div>
                </TabsContent>
                 <TabsContent value="rental-details">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Rental Details</CardTitle>
                                <CardDescription>Information about the contract and property occupied by the tenant.</CardDescription>
                            </div>
                            {contractData.id && !isEditing && (
                                <MoveTenantDialog 
                                    contractId={contractData.id}
                                    currentLocation={{ property: contractData.property!, unit: contractData.unitCode!, room: contractData.roomCode }}
                                />
                            )}
                        </CardHeader>
                        <CardContent>
                            {contractData.id && (unitData.property || roomData) ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader><CardTitle>Contract Information</CardTitle></CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span>Contract No:</span> <span className="font-medium">{contractData.contractNo}</span></div>
                                            <div className="flex justify-between"><span>Start Date:</span> <span className="font-medium">{format(new Date(contractData.startDate!), 'PP')}</span></div>
                                            <div className="flex justify-between"><span>End Date:</span> <span className="font-medium">{format(new Date(contractData.endDate!), 'PP')}</span></div>
                                            <div className="flex justify-between"><span>Total Rent:</span> <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(contractData.totalRent || 0)}</span></div>
                                            <div className="flex justify-between items-center"><span>Status:</span> <Badge>{contractData.status}</Badge></div>
                                            <Button asChild className="w-full mt-4">
                                                <Link href={`/tenancy/contract?id=${contractData.id}`}>View Full Contract</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle>Property & Unit</CardTitle></CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span>Property:</span> <span className="font-medium">{unitData.property?.name}</span></div>
                                            <div className="flex justify-between"><span>Unit Code:</span> <span className="font-medium">{unitData.unitCode}</span></div>
                                            <div className="flex justify-between"><span>Unit Type:</span> <span className="font-medium">{unitData.unitType}</span></div>
                                            <div className="flex justify-between"><span>Floor:</span> <span className="font-medium">{unitData.floor}</span></div>
                                            <div className="flex justify-between"><span>Address:</span> <span className="font-medium text-right">{unitData.property?.address1}</span></div>
                                            <Button asChild className="w-full mt-4">
                                                <Link href={`/property/properties?code=${unitData.propertyCode}`}>View Full Property</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {roomData.id && (
                                        <Card>
                                            <CardHeader className="p-4"><CardTitle className="text-base">Room Details</CardTitle></CardHeader>
                                            <CardContent className="space-y-2 text-sm p-4">
                                                <div className="flex justify-between"><span>Room Code:</span> <span className="font-medium">{roomData.roomCode}</span></div>
                                                <div className="flex justify-between"><span>Room Name:</span> <span className="font-medium">{roomData.roomName}</span></div>
                                                <div className="flex justify-between"><span>Room Type:</span> <span className="font-medium">{roomData.roomType}</span></div>
                                                <div className="flex justify-between"><span>Rent:</span> <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(roomData.rentAmount || 0)} / {roomData.rentFrequency}</span></div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <Home className="mx-auto h-12 w-12" />
                                    <p className="mt-4">No rental information linked to this tenant's contract.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="security-deposit">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Deposit</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="securityDepositAmount" render={({ field }) => (<FormItem><Label>Deposit Amount</Label><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} disabled={!isEditing}/></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="securityDepositStatus" render={({ field }) => (<FormItem><Label>Payment Status</Label><Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="Select status"/></SelectTrigger></FormControl><SelectContent><SelectItem value="paid">Paid</SelectItem><SelectItem value="unpaid">Unpaid</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            </div>
                            <Card>
                                <CardHeader><CardTitle>Return Details</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className='p-4 border rounded-md bg-muted/50'>
                                        <p className='text-sm text-muted-foreground'>Original Deposit Amount</p>
                                        <p className='text-2xl font-bold text-primary'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(form.getValues('securityDepositAmount') || 0)}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="securityDepositReturnDate" render={({ field }) => (<FormItem><Label>Return Date</Label><FormControl><Input type="date" {...field} disabled={!isEditing}/></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="securityDepositReturnedAmount" render={({ field }) => (<FormItem><Label>Returned Amount</Label><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} disabled={!isEditing}/></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                    <FormField control={form.control} name="securityDepositRemarks" render={({ field }) => (<FormItem><Label>Remarks</Label><FormControl><Textarea placeholder="Remarks on return (e.g., deductions for damages)" {...field} disabled={!isEditing}/></FormControl><FormMessage /></FormItem>)} />
                                    <Button disabled={!isEditing}>Process Return</Button>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="subscription-invoice">
                    <InvoiceList
                        tenant={form.getValues()}
                        invoices={invoices}
                        isLoading={isLoadingInvoices}
                        onRefresh={() => fetchInvoices(form.getValues('code'))}
                    />
                </TabsContent>
                <TabsContent value="pdc">
                    <Card>
                        <CardHeader>
                            <CardTitle>PDC Payment Schedule</CardTitle>
                            <CardDescription>
                                This schedule is linked to Contract No: 
                                <Button variant="link" className="p-1" asChild>
                                    <Link href={`/tenancy/contract?id=${contractData.id}`}>{contractData.contractNo}</Link>
                                </Button>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Installment</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contractData.paymentSchedule && contractData.paymentSchedule.length > 0 ? (
                                        contractData.paymentSchedule.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.installment}</TableCell>
                                                <TableCell>{format(new Date(item.dueDate), 'PP')}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.amount)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={item.status === 'paid' ? 'default' : 'secondary'} className={item.status === 'paid' ? 'bg-green-500/20 text-green-700 border-transparent' : ''}>
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No payment schedule found for the linked contract.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="termination">
                    <Card>
                        <CardHeader><CardTitle>Contract Termination</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Termination Date</Label>
                                <Input type="date" disabled={!isEditing}/>
                            </div>
                            <div>
                                <Label>Reason for Termination</Label>
                                <Textarea placeholder="e.g., Early exit, end of contract..." disabled={!isEditing}/>
                            </div>
                            <div>
                                <Label>Final Settlement Amount</Label>
                                <Input type="number" placeholder="0.00" disabled={!isEditing} />
                            </div>
                            <Button variant="destructive" disabled={!isEditing}>Terminate Contract</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </form>
    </Form>
  );
}
