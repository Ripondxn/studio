
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
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { unitSchema, type Unit } from './schema';
import { addUnit, getUnitLookups } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UnitFormData = Omit<Unit, 'id'>;
const unitFormSchema = unitSchema.omit({ id: true });

export function AddUnitDialog({ propertyCode, onUnitAdded }: { propertyCode: string, onUnitAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<{ properties: { value: string, label: string }[], floors: { value: string, label: string }[] }>({ properties: [], floors: [] });

  useEffect(() => {
      if(isOpen) {
          getUnitLookups(propertyCode).then(setLookups);
      }
  }, [isOpen, propertyCode]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
        unitCode: '',
        propertyCode: propertyCode,
        floor: '',
        unitType: '',
        annualRent: 0,
        unitStatus: 'Active',
    }
  });

  const onSubmit = async (data: UnitFormData) => {
    setIsSaving(true);
    const result = await addUnit({ ...data, propertyCode });

    if (result.success) {
      toast({
        title: 'Unit Added',
        description: `Successfully added new unit "${data.unitCode}".`,
      });
      setIsOpen(false);
      reset();
      onUnitAdded();
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
          <Plus className="mr-2 h-4 w-4" /> Add Unit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Add New Unit</DialogTitle>
            <DialogDescription>
                Fill in the details for the new unit in property {propertyCode}.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                    <Input id="unitType" {...register('unitType')} />
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
                    {errors.unitStatus && <p className="text-destructive text-xs mt-1">{errors.unitStatus.message}</p>}
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Unit
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
