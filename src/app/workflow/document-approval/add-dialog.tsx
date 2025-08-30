
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { submitDocumentForApproval } from './actions';
import { documentForApprovalSchema } from './schema';
import type { UserRole } from '@/app/admin/user-roles/schema';
import { format } from 'date-fns';

const formSchema = documentForApprovalSchema.omit({
    id: true,
    submittedBy: true,
    currentStatus: true,
    approvalHistory: true,
});

type FormData = z.infer<typeof formSchema>;

interface AddDocumentDialogProps {
  currentUser: UserRole;
  onSuccess: () => void;
}

export function AddDocumentDialog({ currentUser, onSuccess }: AddDocumentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      docType: '',
      referenceNo: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open) {
      form.reset({
        docType: '',
        referenceNo: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
      });
    }
    setIsOpen(open);
  }

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    const result = await submitDocumentForApproval(data, currentUser.name, currentUser.role);

    if (result.success) {
      toast({
        title: 'Document Submitted',
        description: `Document "${data.docType}" has been submitted for approval.`,
      });
      onSuccess();
      setIsOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Submit New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Submit Document for Approval</DialogTitle>
            <DialogDescription>
              Fill in the details for the document you are submitting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="docType">Document Type</Label>
                <Input id="docType" {...form.register('docType')} placeholder="e.g., Tenancy Contract, Service Agreement" />
                {form.formState.errors.docType && <p className="text-destructive text-xs mt-1">{form.formState.errors.docType.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="referenceNo">Reference No</Label>
                <Input id="referenceNo" {...form.register('referenceNo')} placeholder="e.g., Contract #, Invoice #" />
                {form.formState.errors.referenceNo && <p className="text-destructive text-xs mt-1">{form.formState.errors.referenceNo.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="date">Document Date</Label>
                <Input id="date" type="date" {...form.register('date')} />
                {form.formState.errors.date && <p className="text-destructive text-xs mt-1">{form.formState.errors.date.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Description / Notes</Label>
                <Textarea id="description" {...form.register('description')} placeholder="Provide a brief summary or any relevant notes."/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Approval
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
