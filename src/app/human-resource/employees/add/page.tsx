
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

  const currentEmployee = watch();
  
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
        handleFindClick('new');
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
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save
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
                    {/* Form fields here */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
             <TabsContent value="documents">
                <Card>
                    <CardHeader><CardTitle>Official Documents</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {/* Document fields here */}
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="compensation">
                <Card>
                    <CardHeader><CardTitle>Compensation Details</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {/* Compensation fields here */}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="attachments">
              <Card>
                <CardHeader><CardTitle>Attachments</CardTitle></CardHeader>
                <CardContent>
                    {/* Attachments table here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
}
