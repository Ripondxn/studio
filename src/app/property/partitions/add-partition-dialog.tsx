
'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partitionSchema, type Partition } from './schema';
import { addPartition, getPartitionLookups } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PartitionFormData = Omit<Partition, 'id'>;
const partitionFormSchema = partitionSchema.omit({ id: true });

export function AddPartitionDialog({ propertyCode, onPartitionAdded }: { propertyCode: string, onPartitionAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<{ units: { value: string, label: string }[], floors: { value: string, label: string }[], rooms: { value: string, label: string }[] }>({ units: [], floors: [], rooms: [] });

  useEffect(() => {
      if(isOpen) {
          getPartitionLookups(propertyCode).then(setLookups);
      }
  }, [isOpen, propertyCode]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PartitionFormData>({
    resolver: zodResolver(partitionFormSchema),
    defaultValues: {
        partitionCode: '',
        partitionName: '',
        propertyCode: propertyCode,
        unitCode: '',
        floorCode: '',
        roomCode: '',
        monthlyRent: 0,
        status: 'Active',
    }
  });

  const onSubmit = async (data: PartitionFormData) => {
    setIsSaving(true);
    const result = await addPartition({ ...data, propertyCode });

    if (result.success) {
      toast({
        title: 'Partition Added',
        description: `Successfully added new partition "${data.partitionName}".`,
      });
      setIsOpen(false);
      reset();
      onPartitionAdded();
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
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Partition
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Add New Partition</DialogTitle>
            <DialogDescription>
                Fill in the details for the new partition in property {propertyCode}.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                    <Label htmlFor="floorCode">Floor</Label>
                    <Controller
                        name="floorCode"
                        control={control}
                        render={({ field }) => (
                           <Combobox
                                options={lookups.floors}
                                value={field.value}
                                onSelect={field.onChange}
                                placeholder="Select a floor"
                           />
                        )}
                    />
                    {errors.floorCode && <p className="text-destructive text-xs mt-1">{errors.floorCode.message}</p>}
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
                    <Label htmlFor="roomCode">Room</Label>
                    <Controller
                        name="roomCode"
                        control={control}
                        render={({ field }) => (
                           <Combobox
                                options={lookups.rooms}
                                value={field.value}
                                onSelect={field.onChange}
                                placeholder="Select a room"
                           />
                        )}
                    />
                    {errors.roomCode && <p className="text-destructive text-xs mt-1">{errors.roomCode.message}</p>}
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Partition
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
