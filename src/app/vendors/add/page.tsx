

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { vendorSchema, type Vendor } from '../schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';


type Attachment = {
  id: number;
  name: string;
  file: File | null | string;
  url?: string;
  remarks: string;
  isLink: boolean;
};

const initialVendorData: Vendor = {
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
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const form = useForm<Vendor>({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialVendorData,
  });

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

  const onSave = async (data: Vendor) => {
    setIsSaving(true);
    try {
      const dataToSave = {
        vendorData: data,
        attachments: attachments.map(a => ({ 
            id: a.id, 
            name: a.name, 
            file: a.file instanceof File ? a.file.name : a.file, 
            remarks: a.remarks,
            isLink: a.isLink 
        })),
      };

      const result = await saveVendorData(dataToSave, isNewRecord);
      if (result.success) {
        toast({
          title: "Success",
          description: `Vendor "${data.name}" saved successfully.`,
        });
        setIsEditing(false);
        if (isNewRecord) {
            router.push(`/vendors/add?code=${data.code}`);
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
        description: (error as Error).message || "Failed to save vendor data.",
      });
    } finally {
      setIsSaving(false);
    }
  }


  const handleCancelClick = () => {
     if (isNewRecord) {
        router.push('/vendors');
     } else {
        form.reset();
        setAttachments(form.getValues().attachments || []);
        setIsEditing(false);
     }
  }

  const handleFindClick = async (code?: string) => {
    const codeToFind = code || form.getValues('code');
    if (!codeToFind) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a Vendor Code to find.',
      });
      return;
    }
    
    try {
      const result = await findVendorData(codeToFind);
      if (result.success && result.data) {
        const fullVendorData = { ...initialVendorData, ...(result.data.vendorData || {}) };
        form.reset(fullVendorData);
        setAttachments(result.data.attachments ? result.data.attachments.map((a: any) => ({...a, file: a.file || null, url: undefined})) : []);
        
        if (codeToFind !== 'new') {
            setIsNewRecord(false);
            setIsEditing(false);
        } else {
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
    }
  };

  const handleDelete = async () => {
    const code = form.getValues('code');
    if (!code) return;
    try {
      const result = await deleteVendorData(code);
      if (result.success) {
        toast({
          title: 'Deleted',
          description: `Vendor "${form.getValues('name')}" has been deleted.`,
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
  
  const pageTitle = isNewRecord ? 'Add New Vendor' : `Edit Vendor: ${form.watch('name')}`;

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
                <Button type="button" variant="outline" onClick={() => router.push('/vendors')}>
                    <X className="mr-2 h-4 w-4" /> Close
                </Button>
            </div>
        </div>
      
      <Tabs defaultValue="vendor-info">
        <TabsList>
            <TabsTrigger value="vendor-info">Vendor Info</TabsTrigger>
            <TabsTrigger value="bank-details">Bank Details</TabsTrigger>
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
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                           <Label htmlFor="code">Code</Label>
                           <div className="flex items-end gap-2">
                                <FormControl>
                                    <Input {...field} disabled={!isNewRecord} />
                                </FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={() => router.push('/vendors/add')} disabled={!isNewRecord}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                           </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                           <Label htmlFor="bankName">Bank Name</Label>
                            <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                           <Label htmlFor="accountNumber">Account No</Label>
                           <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="iban"
                      render={({ field }) => (
                        <FormItem>
                           <Label htmlFor="iban">IBAN No</Label>
                           <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                </CardContent>
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

       <div className="mt-6 flex justify-end">
         <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button
                type="button"
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
                vendor "{form.getValues('name')}".
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
