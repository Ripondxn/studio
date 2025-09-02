

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import { saveEmployeeData, findEmployeeData, deleteEmployeeData } from '../actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { employeeSchema, type Employee } from '../schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { handleFileUpload } from '@/app/services/attachment-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

type Attachment = {
  id: number;
  name: string;
  file: File | null | string;
  url?: string;
  remarks: string;
  isLink: boolean;
};

const initialEmployeeData: Omit<Employee, 'id'> = {
    employeeId: '',
    name: '',
    dateOfBirth: '',
    nationalId: '',
    nationalIdExpiry: '',
    passportNo: '',
    passportExpiry: '',
    visaDetails: { number: '', type: '', expiryDate: '' },
    medicalCard: { number: '', provider: '', expiryDate: '' },
    insuranceDetails: { policyNumber: '', provider: '', expiryDate: '', coverageDetails: '' },
    profession: '',
    department: '',
    joiningDate: '',
    mobile: '',
    email: '',
    address: '',
    salaryScale: { grade: '', level: '', amount: 0 },
    photo: null,
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

export default function EmployeeAddPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCode, setIsAutoCode] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const formMethods = useForm<Employee>({
    resolver: zodResolver(employeeSchema.omit({id: true})),
    defaultValues: initialEmployeeData,
  });

  const { control, handleSubmit, watch, setValue, reset, getValues } = formMethods;

  const handleFindClick = useCallback(async (id: string) => {
    try {
      const result = await findEmployeeData(id);
      if (result.success && result.data) {
        const fullData = { ...initialEmployeeData, ...(result.data || {}) };
        reset(fullData);
        setAttachments(result.data.attachments ? result.data.attachments.map((a: any) => ({...a, file: a.file || null, url: undefined})) : []);
        
        if (id !== 'new') {
            setIsNewRecord(false);
            setIsEditing(false);
            setIsAutoCode(false);
        } else {
            setIsNewRecord(true);
            setIsEditing(true);
            setIsAutoCode(true);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Not Found',
          description: `No record found for Employee ID: ${id}. You can create a new one.`,
        });
        const newEmployeeResult = await findEmployeeData('new');
        if (newEmployeeResult.success && newEmployeeResult.data) {
          reset({ ...initialEmployeeData, employeeId: newEmployeeResult.data.employeeId });
        }
        setIsNewRecord(true);
        setIsEditing(true);
        setIsAutoCode(true);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to find employee data.',
      });
    }
  }, [reset, toast]);
  
  useEffect(() => {
    const employeeId = searchParams.get('id');
    if (employeeId) {
      handleFindClick(employeeId);
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
  
  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setValue('photo', base64, { shouldDirty: true });
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const onSave = async (data: Omit<Employee, 'id'>) => {
    setIsSaving(true);
    try {
      const processedAttachments = await Promise.all(
        attachments.map(async (att) => {
          let fileData: string | null = null;
          if (att.isLink) {
            fileData = typeof att.file === 'string' ? att.file : null;
          } else if (att.file instanceof File) {
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
          };
        })
      );

      const dataToSave = {
        ...data,
        attachments: processedAttachments,
      };

      const result = await saveEmployeeData(dataToSave, isNewRecord, isAutoCode);

      if (result.success && result.data) {
        toast({
          title: "Success",
          description: `Employee "${data.name}" saved successfully.`,
        });
        setIsEditing(false);
        if (isNewRecord) {
          router.push(`/human-resource/employees/add?id=${result.data.id}`);
        } else {
          reset(data);
          setAttachments(processedAttachments.map(a => ({...a, url: undefined})));
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
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    if (isNewRecord) {
      router.push('/human-resource/employees');
    } else {
      reset();
      setAttachments(getValues().attachments || []);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const id = getValues('id');
    if (!id) return;
    try {
      const result = await deleteEmployeeData(id);
      if (result.success) {
        toast({ title: 'Deleted', description: `Employee "${getValues('name')}" has been deleted.` });
        router.push('/human-resource/employees');
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
  };

  const pageTitle = isNewRecord ? 'Add New Employee' : `Edit Employee: ${watch('name')}`;

  const getViewLink = (item: Attachment): string => {
    if (item.isLink && typeof item.file === 'string') {
        return item.file;
    }
    if (item.url) { // This is for new, unsaved file uploads
        return item.url;
    }
    if (typeof item.file === 'string' && (item.file.startsWith('data:') || item.file.startsWith('gdrive:'))) {
        // Note: gdrive links aren't directly viewable and would need a download route
        return item.file;
    }
    return '#';
  };
  
  return (
    <div className="container mx-auto p-4 bg-background">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-primary font-headline">{pageTitle}</h1>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button type="button" onClick={handleEditClick}><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
              )}
              {isEditing && (
                <>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleCancelClick}><X className="mr-2 h-4 w-4" /> Cancel</Button>
                </>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={isNewRecord || isEditing}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Employee
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently delete "{watch('name')}".</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="button" variant="outline" onClick={() => router.push('/human-resource/employees')}><X className="mr-2 h-4 w-4" /> Close</Button>
            </div>
          </div>
        
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Employee Information</TabsTrigger>
              <TabsTrigger value="documents">Official Documents</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <Card>
                <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="w-24 h-24 border">
                      <AvatarImage src={watch('photo') || undefined} />
                      <AvatarFallback>{watch('name')?.charAt(0) || 'E'}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Label>Profile Photo</Label>
                      <Input type="file" accept="image/*" onChange={handlePhotoChange} disabled={!isEditing} />
                      <p className="text-xs text-muted-foreground">Upload a profile picture for the employee.</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormField
                      control={control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                           <Label>Employee ID</Label>
                            <div className="flex items-end gap-2">
                                <FormControl><Input {...field} disabled={isAutoCode || !isEditing} /></FormControl>
                                <div className="flex items-center space-x-2 pb-1">
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
                           <Label>Full Name</Label>
                           <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                           <Label>Date of Birth</Label>
                            <FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                           <Label>Mobile</Label>
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
                           <Label>Email</Label>
                           <FormControl><Input type="email" {...field} disabled={!isEditing} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                           <Label>Address</Label>
                            <FormControl><Textarea {...field} disabled={!isEditing} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                           <Label>Profession</Label>
                           <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                           <Label>Department</Label>
                           <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={control}
                      name="joiningDate"
                      render={({ field }) => (
                        <FormItem>
                           <Label>Joining Date</Label>
                            <FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
             <TabsContent value="documents">
                <Card>
                    <CardHeader><CardTitle>Official Documents</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 border rounded-md">
                           <h4 className="font-semibold mb-4">National ID / Emirates ID</h4>
                           <div className="grid grid-cols-2 gap-4">
                                <FormField control={control} name="nationalId" render={({field}) => (<FormItem><Label>Number</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                                <FormField control={control} name="nationalIdExpiry" render={({field}) => (<FormItem><Label>Expiry Date</Label><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                           </div>
                        </div>
                        <div className="p-4 border rounded-md">
                           <h4 className="font-semibold mb-4">Passport</h4>
                           <div className="grid grid-cols-2 gap-4">
                                <FormField control={control} name="passportNo" render={({field}) => (<FormItem><Label>Number</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                                <FormField control={control} name="passportExpiry" render={({field}) => (<FormItem><Label>Expiry Date</Label><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                           </div>
                        </div>
                         <div className="p-4 border rounded-md">
                           <h4 className="font-semibold mb-4">Visa Details</h4>
                           <div className="grid grid-cols-3 gap-4">
                                <FormField control={control} name="visaDetails.number" render={({field}) => (<FormItem><Label>Number</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                                <FormField control={control} name="visaDetails.type" render={({field}) => (<FormItem><Label>Type</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                                <FormField control={control} name="visaDetails.expiryDate" render={({field}) => (<FormItem><Label>Expiry Date</Label><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                           </div>
                        </div>
                         <div className="p-4 border rounded-md">
                           <h4 className="font-semibold mb-4">Medical Card</h4>
                           <div className="grid grid-cols-3 gap-4">
                                <FormField control={control} name="medicalCard.number" render={({field}) => (<FormItem><Label>Number</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                                <FormField control={control} name="medicalCard.provider" render={({field}) => (<FormItem><Label>Provider</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                                <FormField control={control} name="medicalCard.expiryDate" render={({field}) => (<FormItem><Label>Expiry Date</Label><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                           </div>
                        </div>
                         <div className="p-4 border rounded-md">
                           <h4 className="font-semibold mb-4">Insurance Details</h4>
                           <div className="grid grid-cols-3 gap-4">
                                <FormField control={control} name="insuranceDetails.policyNumber" render={({field}) => (<FormItem><Label>Policy Number</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                                <FormField control={control} name="insuranceDetails.provider" render={({field}) => (<FormItem><Label>Provider</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                                <FormField control={control} name="insuranceDetails.expiryDate" render={({field}) => (<FormItem><Label>Expiry Date</Label><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                           </div>
                           <div className="mt-4"><FormField control={control} name="insuranceDetails.coverageDetails" render={({field}) => (<FormItem><Label>Coverage Details</Label><FormControl><Textarea {...field} disabled={!isEditing} /></FormControl></FormItem>)} /></div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="compensation">
                <Card>
                    <CardHeader><CardTitle>Compensation Details</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                       <div className="p-4 border rounded-md">
                           <h4 className="font-semibold mb-4">Salary Scale</h4>
                           <div className="grid grid-cols-3 gap-4">
                                <FormField control={control} name="salaryScale.grade" render={({field}) => (<FormItem><Label>Grade</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                                <FormField control={control} name="salaryScale.level" render={({field}) => (<FormItem><Label>Level</Label><FormControl><Input {...field} disabled={!isEditing} /></FormControl></FormItem>)} />
                                <FormField control={control} name="salaryScale.amount" render={({field}) => (<FormItem><Label>Basic Salary</Label><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} disabled={!isEditing} /></FormControl></FormItem>)} />
                           </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="attachments">
              <Card>
                <CardHeader><CardTitle>Attachments</CardTitle></CardHeader>
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
                                         <div className="mt-1">
                                            <a href={getViewLink(item)} target="_blank" className="text-primary hover:underline text-sm" rel="noopener noreferrer">
                                                <Button type="button" variant="link" size="sm" className="p-0 h-auto" disabled={!item.file}>
                                                    <Eye className="mr-1 h-3 w-3"/> View
                                                </Button>
                                            </a>
                                         </div>
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
      </FormProvider>
    </div>
  );
}
