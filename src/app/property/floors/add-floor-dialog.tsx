
'use client';

import { useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { floorSchema } from './schema';
import { addFloor } from './actions';

type FloorFormData = Omit<Floor, 'id'>;
const floorFormSchema = floorSchema.omit({ id: true });

export function AddFloorDialog({ propertyCode, onFloorAdded }: { propertyCode: string, onFloorAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FloorFormData>({
    resolver: zodResolver(floorFormSchema),
    defaultValues: {
        floorCode: '',
        floorName: '',
        propertyCode: propertyCode,
        noOfUnits: 0,
    }
  });

  const onSubmit = async (data: FloorFormData) => {
    setIsSaving(true);
    const result = await addFloor({ ...data, propertyCode });

    if (result.success) {
      toast({
        title: 'Floor Added',
        description: `Successfully added new floor "${data.floorName}".`,
      });
      setIsOpen(false);
      reset();
      onFloorAdded();
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
          <Plus className="mr-2 h-4 w-4" /> Add Floor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Add New Floor</DialogTitle>
            <DialogDescription>
                Fill in the details for the new floor in property {propertyCode}.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="floorCode">Floor Code</Label>
                    <Input id="floorCode" {...register('floorCode')} />
                    {errors.floorCode && <p className="text-destructive text-xs mt-1">{errors.floorCode.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="floorName">Floor Name</Label>
                    <Input id="floorName" {...register('floorName')} />
                    {errors.floorName && <p className="text-destructive text-xs mt-1">{errors.floorName.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="noOfUnits">Number of Units</Label>
                    <Input id="noOfUnits" type="number" {...register('noOfUnits', { valueAsNumber: true })} />
                    {errors.noOfUnits && <p className="text-destructive text-xs mt-1">{errors.noOfUnits.message}</p>}
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Floor
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
