
'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assetSchema, type Asset } from './schema';
import { updateAssetStatus } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['In Stock', 'Assigned', 'Damaged', 'Out for Repair', 'Retired']),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

interface UpdateStatusDialogProps {
  asset: Asset;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function UpdateStatusDialog({ asset, isOpen, setIsOpen, onSuccess }: UpdateStatusDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateStatusFormData>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      id: asset.id,
      status: asset.status || 'In Stock',
      assignedTo: asset.assignedTo || '',
      notes: '',
    },
  });
  
  useEffect(() => {
    if(isOpen) {
        reset({
            id: asset.id,
            status: asset.status || 'In Stock',
            assignedTo: asset.assignedTo || '',
            notes: '',
        });
    }
  }, [isOpen, asset, reset]);


  const onSubmit = async (data: UpdateStatusFormData) => {
    setIsSaving(true);
    const result = await updateAssetStatus(data);

    if (result.success) {
      toast({
        title: 'Asset Status Updated',
        description: `Successfully updated asset "${asset.assetName}".`,
      });
      setIsOpen(false);
      onSuccess();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Status for {asset.assetName}</DialogTitle>
            <DialogDescription>
              Log a new event in the asset's history.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="In Stock">In Stock</SelectItem>
                                <SelectItem value="Assigned">Assigned</SelectItem>
                                <SelectItem value="Damaged">Damaged</SelectItem>
                                <SelectItem value="Out for Repair">Out for Repair</SelectItem>
                                <SelectItem value="Retired">Retired</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input id="assignedTo" {...register('assignedTo')} placeholder="Employee Name / ID" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="notes">Notes / Remarks</Label>
                <Textarea id="notes" {...register('notes')} placeholder="e.g., Exchanged with Mr. B, screen cracked, sent for repair." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

