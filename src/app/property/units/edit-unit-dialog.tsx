

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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { unitSchema, type Unit } from './schema';
import { updateUnit, getUnitLookups } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const unitFormSchema = unitSchema.omit({ propertyCode: true });

interface EditUnitDialogProps {
  unit: Unit,
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
  onUnitUpdated: () => void;
}

export function EditUnitDialog({ unit, isOpen, setIsOpen, onUnitUpdated }: EditUnitDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<{ properties: { value: string, label: string }[], floors: { value: string, label: string }[] }>({ properties: [], floors: [] });

  useEffect(() => {
      if(isOpen) {
          getUnitLookups(unit.propertyCode).then(setLookups);
      }
  }, [isOpen, unit.propertyCode]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof unitFormSchema>>({
    resolver: zodResolver(unitFormSchema),
  });

  useEffect(() => {
    if(isOpen) {
        reset(unit);
    }
  }, [unit, reset, isOpen]);

  const onSubmit = async (data: z.infer<typeof unitFormSchema>) => {
    setIsSaving(true);
    const result = await updateUnit({ ...data, propertyCode: unit.propertyCode });

    if (result.success) {
      toast({
        title: 'Unit Updated',
        description: `Successfully updated unit "${data.unitCode}".`,
      });
      setIsOpen(false);
      onUnitUpdated();
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
            <DialogTitle>Edit Unit</DialogTitle>
            <DialogDescription>
                Update the details for {unit.unitCode}. Click save when you're done.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Input type="hidden" {...register('id')} />
                 <div className="space-y-2">
                    <Label htmlFor="unitCode">Unit Code</Label>
                    <Input id="unitCode" {...register('unitCode')} />
                    {errors.unitCode && <p className="text-destructive text-xs mt-1">{errors.unitCode.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Controller
                        name="floor"
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
                    {errors.floor && <p className="text-destructive text-xs mt-1">{errors.floor.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="unitType">Unit Type</Label>
                     <Controller
                        name="unitType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a unit type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1BHK">1BHK</SelectItem>
                                    <SelectItem value="2BHK">2BHK</SelectItem>
                                    <SelectItem value="3BHK">3BHK</SelectItem>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                    <SelectItem value="Office">Office</SelectItem>
                                    <SelectItem value="Shop">Shop</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.unitType && <p className="text-destructive text-xs mt-1">{errors.unitType.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="annualRent">Annual Rent</Label>
                    <Input id="annualRent" type="number" {...register('annualRent', { valueAsNumber: true })} />
                    {errors.annualRent && <p className="text-destructive text-xs mt-1">{errors.annualRent.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="unitStatus">Status</Label>
                    <Controller
                        name="unitStatus"
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
                    {errors.unitStatus && <p className="text-destructive text-xs mt-1">{errors.unitStatus.message}</p>}
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
