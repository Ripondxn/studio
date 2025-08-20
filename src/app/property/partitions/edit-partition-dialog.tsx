
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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partitionSchema, type Partition } from './schema';
import { updatePartition, getPartitionLookups } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const partitionFormSchema = partitionSchema.omit({ propertyCode: true });

export function EditPartitionDialog({ partition, isOpen, setIsOpen }: { partition: Partition, isOpen: boolean, setIsOpen: (open: boolean) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [lookups, setLookups] = useState<{ units: { value: string, label: string }[] }>({ units: [] });

  useEffect(() => {
      if(isOpen) {
          getPartitionLookups(partition.propertyCode).then(setLookups);
      }
  }, [isOpen, partition.propertyCode]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof partitionFormSchema>>({
    resolver: zodResolver(partitionFormSchema),
  });

  useEffect(() => {
    if(isOpen) {
        reset(partition);
    }
  }, [partition, reset, isOpen]);

  const onSubmit = async (data: z.infer<typeof partitionFormSchema>) => {
    setIsSaving(true);
    const result = await updatePartition(data);

    if (result.success) {
      toast({
        title: 'Partition Updated',
        description: `Successfully updated partition "${data.partitionName}".`,
      });
      setIsOpen(false);
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsSaving(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
        reset();
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Edit Partition</DialogTitle>
            <DialogDescription>
                Update the details for {partition.partitionName}. Click save when you're done.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Input type="hidden" {...register('id')} />
                 <div className="space-y-2">
                    <Label htmlFor="partitionCode">Partition Code</Label>
                    <Input id="partitionCode" {...register('partitionCode')} />
                    {errors.partitionCode && <p className="text-destructive text-xs mt-1">{errors.partitionCode.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="partitionName">Partition Name</Label>
                    <Input id="partitionName" {...register('partitionName')} />
                    {errors.partitionName && <p className="text-destructive text-xs mt-1">{errors.partitionName.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="unitCode">Unit</Label>
                    <Controller
                        name="unitCode"
                        control={control}
                        render={({ field }) => (
                           <Combobox
                                options={lookups.units}
                                value={field.value}
                                onSelect={field.onChange}
                                placeholder="Select a unit"
                           />
                        )}
                    />
                    {errors.unitCode && <p className="text-destructive text-xs mt-1">{errors.unitCode.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="monthlyRent">Monthly Rent</Label>
                    <Input id="monthlyRent" type="number" {...register('monthlyRent', { valueAsNumber: true })} />
                    {errors.monthlyRent && <p className="text-destructive text-xs mt-1">{errors.monthlyRent.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.status && <p className="text-destructive text-xs mt-1">{errors.status.message}</p>}
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving || !isDirty}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
