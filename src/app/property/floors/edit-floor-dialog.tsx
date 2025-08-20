
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { floorSchema, type Floor } from './schema';
import { updateFloor } from './actions';

const floorFormSchema = floorSchema.omit({ propertyCode: true });

export function EditFloorDialog({ floor, isOpen, setIsOpen }: { floor: Floor, isOpen: boolean, setIsOpen: (open: boolean) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof floorFormSchema>>({
    resolver: zodResolver(floorFormSchema),
  });

  useEffect(() => {
    if(isOpen) {
        reset(floor);
    }
  }, [floor, reset, isOpen]);

  const onSubmit = async (data: z.infer<typeof floorFormSchema>) => {
    setIsSaving(true);
    const result = await updateFloor(data);

    if (result.success) {
      toast({
        title: 'Floor Updated',
        description: `Successfully updated floor "${data.floorName}".`,
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
            <DialogTitle>Edit Floor</DialogTitle>
            <DialogDescription>
                Update the details for {floor.floorName}. Click save when you're done.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Input type="hidden" {...register('id')} />
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
