
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
  Building,
  Home,
  Eye,
  Building2 as BuildingIcon,
  FileText,
  DollarSign
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
import { saveLandlordData, findLandlordData, deleteLandlordData, getPropertiesForLandlord, getLeaseContractsForLandlord, getPaymentHistoryForLandlord } from '../actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Property } from '@/app/property/properties/list/schema';
import { type LeaseContract, type PaymentInstallment } from '@/app/lease/contract/schema';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Attachment = {
  id: number;
  name: string;
  file: File | null | string;
  url?: string;
  remarks: string;
  isLink: boolean;
};

type PaymentHistoryItem = PaymentInstallment & { property: string, contractNo: string, tenantName: string };

const initialLandlordData = {
    code: '',
    name: '',
    mobile: '',
    email: '',
    address: '',
    bankName: '',
    accountNumber: '',
    iban: '',
    securityDepositAmount: 0,
    securityDepositStatus: 'unpaid',
    securityDepositReturnDate: '',
    securityDepositReturnedAmount: 0,
    securityDepositRemarks: '',
};

export default function LandlordPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [landlordData, setLandlordData] = useState(initialLandlordData);
  const [initialData, setInitialData] = useState(initialLandlordData);
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [initialAttachments, setInitialAttachments] = useState<Attachment[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [leaseContracts, setLeaseContracts] = useState<LeaseContract[]>([]);
  const [isLoadingLeaseContracts, setIsLoadingLeaseContracts] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [isLoadingPaymentHistory, setIsLoadingPaymentHistory] = useState(false);


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
    const landlordCode = searchParams.get('code');
    if (landlordCode) {
      setIsNewRecord(false);
      handleFindClick(landlordCode);
    } else {
        setIsNewRecord(true);
        setIsEditing(true); 
        handleFindClick('new');
    }
  }, [searchParams]);

  useEffect(() => {
    if (landlordData.code && !isNewRecord) {
        setIsLoadingProperties(true);
        getPropertiesForLandlord(landlordData.code)
            .then(result => {
                if (result.success && result.data) {
                    setProperties(result.data);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: result.error || "Could not load properties." });
                }
            })
            .finally(() => setIsLoadingProperties(false));

        setIsLoadingLeaseContracts(true);
        getLeaseContractsForLandlord(landlordData.code)
            .then(result => {
                if (result.success && result.data) {
                    setLeaseContracts(result.data);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: result.error || "Could not load lease contracts." });
                }
            })
            .finally(() => setIsLoadingLeaseContracts(false));

        setIsLoadingPaymentHistory(true);
        getPaymentHistoryForLandlord(landlordData.code)
            .then(result => {
                if (result.success && result.data) {
                    setPaymentHistory(result.data);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: result.error || "Could not load payment history." });
                }
            })
            .finally(() => setIsLoadingPaymentHistory(false));
    }
  }, [landlordData.code, isNewRecord, toast]);

  const handleInputChange = (field: keyof typeof landlordData, value: string | number) => {
    setLandlordData(prev => ({ ...prev, [field]: value }));
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
    setLandlordData(data.landlordData || initialLandlordData);
    setAttachments(data.attachments ? data.attachments.map((a: any) => ({...a, file: a.file || null, url: undefined})) : []);
  }

  const setInitialAllData = (data: any) => {
    setInitialData(JSON.parse(JSON.stringify(data.landlordData || initialLandlordData)));
    setInitialAttachments(JSON.parse(JSON.stringify(data.attachments ? data.attachments.map((a: any) => ({...a, file: null})) : [])));
  }

  const handleEditClick = () => {
    setInitialAllData({ landlordData, attachments });
    setIsEditing(true);
  }

  const handleSaveClick = async () => {
    if (!landlordData.code || !landlordData.name) {
         toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Landlord Code and Name are required fields.",
        });
        return;
    }
    setIsSaving(true);
    try {
      const dataToSave = {
        landlordData,
        attachments: attachments.map(a => ({ 
            id: a.id, 
            name: a.name, 
            file: a.file instanceof File ? a.file.name : a.file, 
            remarks: a.remarks,
            isLink: a.isLink 
        })),
      };

      const result = await saveLandlordData(dataToSave, isNewRecord);
      if (result.success) {
        toast({
          title: "Success",
          description: `Landlord "${landlordData.name}" saved successfully.`,
        });
        setIsEditing(false);
        if (isNewRecord) {
            router.push(`/landlord/add?code=${landlordData.code}`);
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
        description: (error as Error).message || "Failed to save landlord data.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const handleCancelClick = () => {
     if (isNewRecord) {
        router.push('/landlord');
     } else {
        setLandlordData(initialData);
        setAttachments(initialAttachments);
        setIsEditing(false);
     }
  }

  const handleFindClick = async (code?: string) => {
    const codeToFind = code || landlordData.code;
    if (!codeToFind) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a Landlord Code to find.',
      });
      return;
    }
    setIsFinding(true);
    try {
      const result = await findLandlordData(codeToFind);
      if (result.success && result.data) {
        setAllData(result.data);
        if (codeToFind !== 'new') {
            setInitialAllData(result.data);
            setIsNewRecord(false);
            setIsEditing(false);
        } else {
            setInitialAllData({ landlordData: { code: result.data.landlordData.code } });
            setIsNewRecord(true);
            setIsEditing(true);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Not Found',
          description: `No record found for Landlord Code: ${codeToFind}. You can create a new one.`,
        });
        handleFindClick('new');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to find landlord data.',
      });
    } finally {
      setIsFinding(false);
    }
  };

  const handleDelete = async () => {
    if (!landlordData.code) return;
    try {
      const result = await deleteLandlordData(landlordData.code);
      if (result.success) {
        toast({
          title: 'Deleted',
          description: `Landlord "${landlordData.name}" has been deleted.`,
        });
        router.push('/landlord');
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to delete landlord data.',
      });
    }
  };
  
  const pageTitle = isNewRecord ? 'Add New Landlord' : `Edit Landlord: ${initialData.name}`;

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
            <Button variant="outline" onClick={() => router.push('/landlord')}>
                <X className="mr-2 h-4 w-4" /> Close
            </Button>
        </div>
      </div>

       <Tabs defaultValue="info">
            <TabsList>
                <TabsTrigger value="info">Landlord Information</TabsTrigger>
                <TabsTrigger value="security-deposit">Security Deposit</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="lease-contracts">Lease Contracts</TabsTrigger>
                <TabsTrigger value="payment-history">Payment History</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Landlord Information</CardTitle>
                  <CardDescription>Fill in the details of the landlord.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-end gap-2">
                        <div className="flex-grow">
                            <Label htmlFor="code">Code</Label>
                            <Input id="code" value={landlordData.code} onChange={(e) => handleInputChange('code', e.target.value)} disabled />
                        </div>
                        <Button variant="outline" size="icon" onClick={() => router.push('/landlord/add')} disabled={isFinding || !isNewRecord}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={landlordData.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="mobile">Mobile No</Label>
                      <Input id="mobile" value={landlordData.mobile} onChange={(e) => handleInputChange('mobile', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={landlordData.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={landlordData.address} onChange={(e) => handleInputChange('address', e.target.value)} disabled={!isEditing} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bank Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Input id="bankName" value={landlordData.bankName} onChange={(e) => handleInputChange('bankName', e.target.value)} disabled={!isEditing} />
                            </div>
                            <div>
                                <Label htmlFor="accountNumber">Account No</Label>
                                <Input id="accountNumber" value={landlordData.accountNumber} onChange={(e) => handleInputChange('accountNumber', e.target.value)} disabled={!isEditing} />
                            </div>
                            <div>
                                <Label htmlFor="iban">IBAN No</Label>
                                <Input id="iban" value={landlordData.iban} onChange={(e) => handleInputChange('iban', e.target.value)} disabled={!isEditing} />
                            </div>
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
                  </div>
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
                                <Input type="number" placeholder="0.00" value={landlordData.securityDepositAmount} onChange={(e) => handleInputChange('securityDepositAmount', parseFloat(e.target.value))} disabled={!isEditing}/>
                            </div>
                             <div>
                                <Label>Payment Status</Label>
                                <Select value={landlordData.securityDepositStatus} onValueChange={(value) => handleInputChange('securityDepositStatus', value)} disabled={!isEditing}>
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
                                    <p className='text-2xl font-bold text-primary'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(landlordData.securityDepositAmount || 0)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Return Date</Label>
                                        <Input type="date" value={landlordData.securityDepositReturnDate} onChange={(e) => handleInputChange('securityDepositReturnDate', e.target.value)} disabled={!isEditing}/>
                                    </div>
                                    <div>
                                        <Label>Returned Amount</Label>
                                        <Input type="number" placeholder="0.00" value={landlordData.securityDepositReturnedAmount} onChange={(e) => handleInputChange('securityDepositReturnedAmount', parseFloat(e.target.value))} disabled={!isEditing}/>
                                    </div>
                                </div>
                                <Textarea placeholder="Remarks on return (e.g., deductions for damages)" value={landlordData.securityDepositRemarks} onChange={(e) => handleInputChange('securityDepositRemarks', e.target.value)} disabled={!isEditing}/>
                                <Button disabled={!isEditing}>Process Return</Button>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="properties">
                <Card>
                    <CardHeader>
                        <CardTitle>Associated Properties</CardTitle>
                        <CardDescription>A list of properties managed for {landlordData.name || 'this landlord'}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingProperties ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : properties.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {properties.map(property => (
                                    <Card key={property.code} className="flex flex-col">
                                        <CardHeader className="flex-row items-start gap-4 space-y-0">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-lg">
                                                    <BuildingIcon className="h-6 w-6 text-secondary-foreground" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">{property.name}</CardTitle>
                                                <CardDescription>{property.propertyType}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Code</span>
                                                <span className="font-medium">{property.code}</span>
                                            </div>
                                             <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Units</span>
                                                <span className="font-medium">{property.noOfUnits}</span>
                                            </div>
                                            <div className="flex justify-between text-sm items-center">
                                                <span className="text-muted-foreground">Status</span>
                                                <Badge variant={property.status === 'Active' ? 'default' : 'secondary'}>{property.status}</Badge>
                                            </div>
                                        </CardContent>
                                        <div className="p-4 pt-0">
                                            <Button asChild className="w-full">
                                                <Link href={`/property/properties?code=${property.code}`}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Property
                                                </Link>
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <Building className="mx-auto h-12 w-12" />
                                <p className="mt-4">No properties found for this landlord.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="lease-contracts">
                <Card>
                    <CardHeader>
                        <CardTitle>Lease Contracts</CardTitle>
                        <CardDescription>A list of lease contracts with {landlordData.name || 'this landlord'}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingLeaseContracts ? (
                             <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : leaseContracts.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Contract No</TableHead>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead className="text-right">Rent</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaseContracts.map(contract => (
                                        <TableRow key={contract.id}>
                                            <TableCell className="font-medium">{contract.contractNo}</TableCell>
                                            <TableCell>{contract.property}</TableCell>
                                            <TableCell>{format(new Date(contract.startDate), 'PP')}</TableCell>
                                            <TableCell>{format(new Date(contract.endDate), 'PP')}</TableCell>
                                            <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(contract.totalRent)}</TableCell>
                                            <TableCell><Badge>{contract.status}</Badge></TableCell>
                                            <TableCell>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/lease/contract?id=${contract.id}`}>
                                                        View Contract
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                             <div className="text-center py-10 text-muted-foreground">
                                <FileText className="mx-auto h-12 w-12" />
                                <p className="mt-4">No lease contracts found for this landlord.</p>
                             </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="payment-history">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                         <CardDescription>A consolidated view of all tenant payments from this landlord's properties.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {isLoadingPaymentHistory ? (
                             <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                         ) : paymentHistory.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Tenant</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paymentHistory.map((payment, index) => (
                                        <TableRow key={`${payment.contractNo}-${payment.installment}`}>
                                            <TableCell>{payment.property}</TableCell>
                                            <TableCell>{payment.tenantName}</TableCell>
                                            <TableCell>{format(new Date(payment.dueDate), 'PP')}</TableCell>
                                            <TableCell className="text-right font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)}</TableCell>
                                            <TableCell><Badge variant={payment.status === 'paid' ? 'default' : 'secondary'} className={payment.status === 'paid' ? 'bg-green-500/20 text-green-700' : ''}>{payment.status}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <DollarSign className="mx-auto h-12 w-12" />
                                <p className="mt-4">No payment history found for this landlord.</p>
                            </div>
                         )}
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
                <Trash2 className="mr-2 h-4 w-4" /> Delete Landlord
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                landlord "{landlordData.name}".
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
