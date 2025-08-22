
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  X,
} from 'lucide-react';
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
import { saveAgentData, findAgentData, deleteAgent } from '../actions';
import { agentSchema, type Agent } from '../schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const initialAgentData: Agent = {
    id: '',
    code: '',
    name: '',
    mobile: '',
    email: '',
    commissionRate: 0,
};

export default function AgentPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const form = useForm<Agent>({
    resolver: zodResolver(agentSchema.omit({ totalCommissionPaid: true, vendorName: true, vendorCode: true })),
    defaultValues: initialAgentData,
  });

  const handleFindClick = async (code: string) => {
    try {
      const result = await findAgentData(code);
      if (result.success && result.data) {
        form.reset(result.data);
        if (code !== 'new') {
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
          description: `No record found for Agent Code: ${code}. You can create a new one.`,
        });
        handleFindClick('new');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to find agent data.',
      });
    }
  };

  useEffect(() => {
    const agentCode = searchParams.get('code');
    if (agentCode) {
      handleFindClick(agentCode);
    } else {
        setIsNewRecord(true);
        setIsEditing(true); 
        handleFindClick('new');
    }
  }, [searchParams]);

  const handleEditClick = () => {
    setIsEditing(true);
  }
  
  const onSubmit = async (data: Agent) => {
    setIsSaving(true);
    try {
      const result = await saveAgentData(data, isNewRecord);
      if (result.success && result.data) {
        toast({
          title: "Success",
          description: `Agent "${data.name}" saved successfully.`,
        });
        setIsEditing(false);
        if (isNewRecord) {
            router.push(`/vendors/agents/add?code=${result.data.code}`);
        } else {
            form.reset(result.data);
        }
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message || "Failed to save agent data.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const handleCancelClick = () => {
     if (isNewRecord) {
        router.push('/vendors/agents');
     } else {
        form.reset();
        setIsEditing(false);
     }
  }
  
  const handleDelete = async () => {
    const code = form.getValues('code');
    if (!code) return;
    try {
      const result = await deleteAgent(code);
      if (result.success) {
        toast({
          title: 'Deleted',
          description: `Agent "${form.getValues('name')}" has been deleted.`,
        });
        router.push('/vendors/agents');
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to delete agent data.',
      });
    }
  };
  
  const pageTitle = isNewRecord ? 'Add New Agent' : `Edit Agent: ${form.watch('name')}`;

  return (
    <div className="container mx-auto p-4 bg-background">
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Agent
                    </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete agent "{form.getValues('name')}".
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
                <Button type="button" variant="outline" onClick={() => router.push('/vendors/agents')}>
                    <X className="mr-2 h-4 w-4" /> Close
                </Button>
            </div>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>Agent Information</CardTitle>
            <CardDescription>Fill in the details of the agent.</CardDescription>
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
                                <Input {...field} disabled />
                            </FormControl>
                            <Button type="button" variant="outline" size="icon" onClick={() => router.push('/vendors/agents/add')} disabled={!isNewRecord}>
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
                    name="commissionRate"
                    render={({ field }) => (
                    <FormItem>
                        <Label htmlFor="commissionRate">Default Commission (Amount)</Label>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} disabled={!isEditing} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            </CardContent>
        </Card>
      </form>
    </Form>
    </div>
  );
}
