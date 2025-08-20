

'use client';

import { useState, useEffect, useRef } from 'react';
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
  Calendar
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Contract, type PaymentInstallment } from '../../contract/schema';
import { type Unit } from '@/app/property/units/schema';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type Attachment = {
  id: number;
  name: string;
  file: File | null | string;
  url?: string;
  remarks: string;
  isLink: boolean;
};

const initialTenantData = {
    code: '',
    name: '',
    mobile: '',
    email: '',
    address: '',
    contractNo: '',
    securityDepositAmount: 0,
    securityDepositStatus: 'unpaid',
    securityDepositReturnDate: '',
    securityDepositReturnedAmount: 0,
    securityDepositRemarks: '',
};

export default function TenantPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [tenantData, setTenantData] = useState(initialTenantData);
  const [initialData, setInitialData] = useState(initialTenantData);

  const [contractData, setContractData] = useState<Partial<Contract>>({});
  const [unitData, setUnitData] = useState<Partial<Unit & { property?: any }>>({});
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [initialAttachments, setInitialAttachments] = useState<Attachment[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        if (attachment.url) {
          URL.revokeObjectURL(attachment.url);
        }
      });
    };
  }, [attachments]);

  useEffect(() => {
    const tenantCode = searchParams.get('code');
    if (tenantCode) {
      setIsNewRecord(false);
      handleFindClick(tenantCode);
    } else {
        setIsNewRecord(true);
        setIsEditing(true); 
        setTenantData(initialTenantData);
        setAttachments([]);
        setContractData({});
        setUnitData({});
    }
  }, [searchParams]);

  const handleInputChange = (field: keyof typeof tenantData, value: string | number) => {
    setTenantData(prev => ({ ...prev, [field]: value }));
  };
  
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

  const setAllData = (data: any) => {
    setTenantData(data.tenantData || initialTenantData);
    setAttachments(data.attachments ? data.attachments.map((a: any) => ({...a, file: a.file || null, url: undefined})) : []);
    setContractData(data.contractData || {});
    setUnitData(data.unitData || {});
  }

  const setInitialAllData = (data: any) => {
    setInitialData(JSON.parse(JSON.stringify(data.tenantData || initialTenantData)));
    setInitialAttachments(JSON.parse(JSON.stringify(data.attachments ? data.attachments.map((a: any) => ({...a, file: null})) : [])));
  }

  const handleEditClick = () => {
    setInitialAllData({ tenantData, attachments });
    setIsEditing(true);
  }

  const handleSaveClick = async () => {
    if (!tenantData.code || !tenantData.name) {
         toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Tenant Code and Name are required fields.",
        });
        return;
    }
    setIsSaving(true);
    try {
      const dataToSave = {
        tenantData,
        attachments: attachments.map(a => ({ 
            id: a.id, 
            name: a.name, 
            file: a.file instanceof File ? a.file.name : a.file, 
            remarks: a.remarks,
            isLink: a.isLink 
        })),
      };

      const result = await saveTenantData(dataToSave, isNewRecord);
      if (result.success) {
        toast({
          title: "Success",
          description: `Tenant "${tenantData.name}" saved successfully.`,
        });
        setIsEditing(false);
        if (isNewRecord) {
            router.push(`/tenancy/tenants/add?code=${tenantData.code}`);
        } else {
            setInitialAllData(dataToSave);
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
        setTenantData(initialData);
        setAttachments(initialAttachments);
        setIsEditing(false);
     }
  }

  const handleFindClick = async (code?: string) => {
    const codeToFind = code || tenantData.code;
    if (!codeToFind) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a Tenant Code to find.',
      });
      return;
    }
    setIsFinding(true);
    try {
      const result = await findTenantData(codeToFind);
      if (result.success && result.data) {
        toast({
          title: 'Found',
          description: `Found record for Tenant Code: ${codeToFind}`,
        });
        setAllData(result.data);
        setInitialAllData(result.data);
        setIsNewRecord(false);
        setIsEditing(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Not Found',
          description: `No record found for Tenant Code: ${codeToFind}. You can create a new one.`,
        });
        const newTenant = { ...initialTenantData, code: codeToFind };
        setAllData({ tenantData: newTenant, contractData: {} });
        setIsNewRecord(true);
        setIsEditing(true);
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
  };

  const handleDelete = async () => {
    if (!tenantData.code) return;
    try {
      const result = await deleteTenantData(tenantData.code);
      if (result.success) {
        toast({
          title: 'Deleted',
          description: `Tenant "${tenantData.name}" has been deleted.`,
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
  
  const pageTitle = isNewRecord ? 'Add New Tenant' : `Edit Tenant: ${initialData.name}`;

  return (
    <div className="container mx-auto p-4 bg-background">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary font-headline">
          {pageTitle}
        </h1>
        <div className="flex items-center gap-2">
            {!isEditing && (
              <Button onClick={handleEditClick}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
            {isEditing && (
              <>
                <Button onClick={handleSaveClick} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="ghost" onClick={handleCancelClick}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => router.push('/tenancy/tenants')}>
                <X className="mr-2 h-4 w-4" /> Close
            </Button>
        </div>
      </div>

        <Tabs defaultValue="info">
            <TabsList>
                <TabsTrigger value="info">Tenant Information</TabsTrigger>
                <TabsTrigger value="rental-details">Rental Details</TabsTrigger>
                <TabsTrigger value="security-deposit">Security Deposit</TabsTrigger>
                <TabsTrigger value="pdc">PDC Schedule</TabsTrigger>
                <TabsTrigger value="termination">Termination</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
                <Card>
                    <CardHeader>
                    <CardTitle>Tenant Information</CardTitle>
                    <CardDescription>Fill in the details of the tenant.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-end gap-2">
                            <div className="flex-grow">
                                <Label htmlFor="code">Code</Label>
                                <Input id="code" value={tenantData.code} onChange={(e) => handleInputChange('code', e.target.value)} disabled={!isNewRecord} />
                            </div>
                            <Button variant="outline" size="icon" onClick={() => handleFindClick()} disabled={isFinding || !isNewRecord}>
                                {isFinding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={tenantData.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={!isEditing} />
                        </div>
                        <div>
                        <Label htmlFor="mobile">Mobile No</Label>
                        <Input id="mobile" value={tenantData.mobile} onChange={(e) => handleInputChange('mobile', e.target.value)} disabled={!isEditing} />
                        </div>
                        <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={tenantData.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={!isEditing} />
                        </div>
                        <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={tenantData.address} onChange={(e) => handleInputChange('address', e.target.value)} disabled={!isEditing} />
                        </div>
                         <div>
                        <Label htmlFor="contractNo">Contract No</Label>
                        <Input id="contractNo" value={tenantData.contractNo} onChange={(e) => handleInputChange('contractNo', e.target.value)} disabled={!isEditing} />
                        </div>
                    </div>

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
                                                    <Button variant="ghost" size="icon" onClick={() => handleAttachmentChange(item.id, 'isLink', !item.isLink)} disabled={!isEditing}>
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
                                            <Button variant="ghost" size="icon" className="text-destructive" disabled={!isEditing} onClick={() => removeAttachmentRow(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button variant="outline" size="sm" className="mt-4" onClick={addAttachmentRow} disabled={!isEditing}>
                                <Plus className="mr-2 h-4 w-4"/> Add Attachment
                            </Button>
                        </CardContent>
                    </Card>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="rental-details">
                <Card>
                    <CardHeader>
                        <CardTitle>Rental Details</CardTitle>
                        <CardDescription>Information about the contract and property occupied by the tenant.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {contractData.id && unitData.property ? (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Contract Information</CardTitle></CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div><Label>Contract No</Label><Input value={contractData.contractNo} disabled /></div>
                                    <div><Label>Start Date</Label><Input value={format(new Date(contractData.startDate!), 'PP')} disabled /></div>
                                    <div><Label>End Date</Label><Input value={format(new Date(contractData.endDate!), 'PP')} disabled /></div>
                                    <div><Label>Total Rent</Label><Input value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(contractData.totalRent || 0)} disabled /></div>
                                    <div><Label>Status</Label><Input value={contractData.status} disabled /></div>
                                    <div className="flex items-end">
                                         <Button asChild className="w-full">
                                            <Link href={`/tenancy/contract?id=${contractData.id}`}>View Full Contract</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader><CardTitle>Property & Unit Information</CardTitle></CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div><Label>Property Name</Label><Input value={unitData.property.name} disabled /></div>
                                    <div><Label>Unit Code</Label><Input value={unitData.unitCode} disabled /></div>
                                    <div><Label>Unit Type</Label><Input value={unitData.unitType} disabled /></div>
                                    <div><Label>Floor</Label><Input value={unitData.floor} disabled /></div>
                                    <div><Label>Property Address</Label><Input value={unitData.property.address1} disabled /></div>
                                     <div className="flex items-end">
                                         <Button asChild className="w-full">
                                            <Link href={`/property/properties?code=${unitData.propertyCode}`}>View Full Property</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
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
                            <div>
                                <Label>Deposit Amount</Label>
                                <Input type="number" placeholder="0.00" value={tenantData.securityDepositAmount} onChange={(e) => handleInputChange('securityDepositAmount', parseFloat(e.target.value))} disabled={!isEditing}/>
                            </div>
                             <div>
                                <Label>Payment Status</Label>
                                <Select value={tenantData.securityDepositStatus} onValueChange={(value) => handleInputChange('securityDepositStatus', value)} disabled={!isEditing}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="unpaid">Unpaid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Card>
                            <CardHeader><CardTitle>Return Details</CardTitle></CardHeader>
                             <CardContent className="space-y-4">
                                <div className='p-4 border rounded-md bg-muted/50'>
                                    <p className='text-sm text-muted-foreground'>Original Deposit Amount</p>
                                    <p className='text-2xl font-bold text-primary'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tenantData.securityDepositAmount || 0)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Return Date</Label>
                                        <Input type="date" value={tenantData.securityDepositReturnDate} onChange={(e) => handleInputChange('securityDepositReturnDate', e.target.value)} disabled={!isEditing}/>
                                    </div>
                                    <div>
                                        <Label>Returned Amount</Label>
                                        <Input type="number" placeholder="0.00" value={tenantData.securityDepositReturnedAmount} onChange={(e) => handleInputChange('securityDepositReturnedAmount', parseFloat(e.target.value))} disabled={!isEditing}/>
                                    </div>
                                </div>
                                <Textarea placeholder="Remarks on return (e.g., deductions for damages)" value={tenantData.securityDepositRemarks} onChange={(e) => handleInputChange('securityDepositRemarks', e.target.value)} disabled={!isEditing}/>
                                <Button disabled={!isEditing}>Process Return</Button>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
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


       <div className="mt-6 flex justify-end">
         <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button
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
                tenant "{tenantData.name}".
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
       </div>
    </div>
  );
}
