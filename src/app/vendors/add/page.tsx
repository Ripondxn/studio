

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
import { saveVendorData, findVendorData, deleteVendorData } from '../actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Attachment = {
  id: number;
  name: string;
  file: File | null | string;
  url?: string;
  remarks: string;
  isLink: boolean;
};

const initialVendorData = {
    code: '',
    name: '',
    mobile: '',
    email: '',
    address: '',
    bankName: '',
    accountNumber: '',
    iban: '',
    agentCode: '',
    agentName: '',
    agentMobile: '',
    agentEmail: '',
    agentCommission: 0,
};

export default function VendorPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [vendorData, setVendorData] = useState(initialVendorData);
  const [initialData, setInitialData] = useState(initialVendorData);
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [initialAttachments, setInitialAttachments] = useState<Attachment[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState('vendor-info');


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
    const vendorCode = searchParams.get('code');
    if (vendorCode) {
      setIsNewRecord(false);
      handleFindClick(vendorCode);
    } else {
        setIsNewRecord(true);
        setIsEditing(true); 
        handleFindClick('new');
    }
  }, [searchParams]);

  const handleInputChange = (field: keyof typeof vendorData, value: string | number) => {
    setVendorData(prev => ({ ...prev, [field]: value }));
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
        isLink: false,
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
    const fullVendorData = { ...initialVendorData, ...(data.vendorData || {}) };
    setVendorData(fullVendorData);
    setAttachments(data.attachments ? data.attachments.map((a: any) => ({...a, file: a.file || null, url: undefined})) : []);
  }

  const setInitialAllData = (data: any) => {
    const fullVendorData = { ...initialVendorData, ...(data.vendorData || {}) };
    setInitialData(JSON.parse(JSON.stringify(fullVendorData)));
    setInitialAttachments(JSON.parse(JSON.stringify(data.attachments ? data.attachments.map((a: any) => ({...a, file: null})) : [])));
  }

  const handleEditClick = () => {
    setInitialAllData({ vendorData, attachments });
    setIsEditing(true);
  }

  const handleSaveClick = async () => {
    if (!vendorData.code || !vendorData.name) {
         toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Vendor Code and Name are required fields.",
        });
        return;
    }
    setIsSaving(true);
    try {
      const dataToSave = {
        vendorData,
        attachments: attachments.map(a => ({ 
            id: a.id, 
            name: a.name, 
            file: a.file instanceof File ? a.file.name : a.file, 
            remarks: a.remarks,
            isLink: a.isLink,
        })),
      };

      const result = await saveVendorData(dataToSave, isNewRecord);
      if (result.success) {
        toast({
          title: "Success",
          description: `Vendor "${vendorData.name}" saved successfully.`,
        });
        setIsEditing(false);
        if (isNewRecord) {
            router.push(`/vendors/add?code=${vendorData.code}`);
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
        description: (error as Error).message || "Failed to save vendor data.",
      });
    } finally {
      setIsSaving(false);
    }
  }
  
  const handleSaveAgentInfoClick = async () => {
    const hasAgentInfo = vendorData.agentMobile || vendorData.agentEmail || vendorData.agentCommission > 0;
    if (hasAgentInfo && !vendorData.agentName) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Agent Name is required when other agent details are provided.",
        });
        return;
    }
    await handleSaveClick();
  }

  const handleCancelClick = () => {
     if (isNewRecord) {
        router.push('/vendors');
     } else {
        setVendorData(initialData);
        setAttachments(initialAttachments);
        setIsEditing(false);
     }
  }

  const handleFindClick = async (code?: string) => {
    const codeToFind = code || vendorData.code;
    if (!codeToFind) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a Vendor Code to find.',
      });
      return;
    }
    setIsFinding(true);
    try {
      const result = await findVendorData(codeToFind);
      if (result.success && result.data) {
        setAllData(result.data);
        if (codeToFind !== 'new') {
            setInitialAllData(result.data);
            setIsNewRecord(false);
            setIsEditing(false);
        } else {
             setInitialAllData({ vendorData: { ...initialVendorData, ...result.data.vendorData } });
             setVendorData({ ...initialVendorData, ...result.data.vendorData });
            setIsNewRecord(true);
            setIsEditing(true);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Not Found',
          description: `No record found for Vendor Code: ${codeToFind}. You can create a new one.`,
        });
        handleFindClick('new');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to find vendor data.',
      });
    } finally {
      setIsFinding(false);
    }
  };

  const handleDelete = async () => {
    if (!vendorData.code) return;
    try {
      const result = await deleteVendorData(vendorData.code);
      if (result.success) {
        toast({
          title: 'Deleted',
          description: `Vendor "${vendorData.name}" has been deleted.`,
        });
        router.push('/vendors');
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to delete vendor data.',
      });
    }
  };
  
  const pageTitle = isNewRecord ? 'Add New Vendor' : `Edit Vendor: ${initialData.name}`;

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
                <Button onClick={handleSaveClick} disabled={isSaving || (activeTab !== 'vendor-info' && activeTab !== 'bank-details')}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="ghost" onClick={handleCancelClick}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => router.push('/vendors')}>
                <X className="mr-2 h-4 w-4" /> Close
            </Button>
        </div>
      </div>
      
      <Tabs defaultValue="vendor-info" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
            <TabsTrigger value="vendor-info">Vendor Info</TabsTrigger>
            <TabsTrigger value="bank-details">Bank Details</TabsTrigger>
            <TabsTrigger value="agent-info">Agent Info</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>
        <TabsContent value="vendor-info">
            <Card>
                <CardHeader>
                <CardTitle>Vendor Information</CardTitle>
                <CardDescription>Fill in the details of the vendor.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-end gap-2">
                        <div className="flex-grow">
                            <Label htmlFor="code">Code</Label>
                            <Input id="code" value={vendorData.code} onChange={(e) => handleInputChange('code', e.target.value)} disabled={!isNewRecord} />
                        </div>
                         <Button variant="outline" size="icon" onClick={() => router.push('/vendors/add')} disabled={isFinding || !isNewRecord}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={vendorData.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                    <Label htmlFor="mobile">Mobile No</Label>
                    <Input id="mobile" value={vendorData.mobile} onChange={(e) => handleInputChange('mobile', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={vendorData.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={vendorData.address} onChange={(e) => handleInputChange('address', e.target.value)} disabled={!isEditing} />
                    </div>
                </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="bank-details">
            <Card>
                <CardHeader>
                    <CardTitle>Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-w-lg">
                    <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" value={vendorData.bankName || ''} onChange={(e) => handleInputChange('bankName', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                        <Label htmlFor="accountNumber">Account No</Label>
                        <Input id="accountNumber" value={vendorData.accountNumber || ''} onChange={(e) => handleInputChange('accountNumber', e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                        <Label htmlFor="iban">IBAN No</Label>
                        <Input id="iban" value={vendorData.iban || ''} onChange={(e) => handleInputChange('iban', e.target.value)} disabled={!isEditing} />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="agent-info">
             <Card>
                <CardHeader>
                    <CardTitle>Agent Information</CardTitle>
                    <CardDescription>Details of the agent associated with this vendor.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="agentCode">Agent Code</Label>
                            <Input id="agentCode" value={vendorData.agentCode || ''} disabled />
                        </div>
                        <div>
                            <Label htmlFor="agentName">Agent Name</Label>
                            <Input id="agentName" value={vendorData.agentName || ''} onChange={(e) => handleInputChange('agentName', e.target.value)} disabled={!isEditing} />
                        </div>
                        <div>
                            <Label htmlFor="agentMobile">Agent Mobile</Label>
                            <Input id="agentMobile" value={vendorData.agentMobile || ''} onChange={(e) => handleInputChange('agentMobile', e.target.value)} disabled={!isEditing} />
                        </div>
                        <div>
                            <Label htmlFor="agentEmail">Agent Email</Label>
                            <Input id="agentEmail" value={vendorData.agentEmail || ''} onChange={(e) => handleInputChange('agentEmail', e.target.value)} disabled={!isEditing} />
                        </div>
                         <div>
                            <Label htmlFor="agentCommission">Commission Amount</Label>
                            <Input id="agentCommission" type="number" value={vendorData.agentCommission || 0} onChange={(e) => handleInputChange('agentCommission', parseFloat(e.target.value) || 0)} disabled={!isEditing} />
                        </div>
                    </div>
                </CardContent>
                 {isEditing && (
                    <CardFooter>
                        <Button onClick={handleSaveAgentInfoClick} disabled={isSaving || activeTab !== 'agent-info'}>
                            {isSaving && activeTab === 'agent-info' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Agent Info
                        </Button>
                    </CardFooter>
                 )}
            </Card>
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
                                            placeholder="e.g. Trade License"
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
        </TabsContent>
      </Tabs>
      

       <div className="mt-6 flex justify-end">
         <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button
                variant="destructive"
                disabled={isNewRecord || isEditing}
            >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Vendor
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                vendor "{vendorData.name}".
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
