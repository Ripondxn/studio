
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
import { roomSchema, type Room } from './schema';
import { updateRoom, getRoomLookups } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const roomFormSchema = roomSchema.omit({ propertyCode: true });

export function EditRoomDialog({ room, isOpen, setIsOpen }: { room: Room, isOpen: boolean, setIsOpen: (open: boolean) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [lookups, setLookups] = useState<{ floors: { value: string, label: string }[], units: {value: string, label: string}[] }>({ floors: [], units: [] });

  useEffect(() => {
      if(isOpen) {
          getRoomLookups(room.propertyCode).then(setLookups);
      }
  }, [isOpen, room.propertyCode]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof roomFormSchema>>({
    resolver: zodResolver(roomFormSchema),
  });

  useEffect(() => {
    if(isOpen) {
        reset(room);
    }
  }, [room, reset, isOpen]);

  const onSubmit = async (data: z.infer<typeof roomFormSchema>) => {
    setIsSaving(true);
    const result = await updateRoom(data);

    if (result.success) {
      toast({
        title: 'Room Updated',
        description: `Successfully updated room "${data.roomName}".`,
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
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
                Update the details for {room.roomName}. Click save when you're done.
            </DialogDescription>
            </DialogHeader>
             <div className="grid gap-4 py-4">
                <Input type="hidden" {...register('id')} />
                <div className="space-y-2">
                    <Label htmlFor="roomCode">Room Code</Label>
                    <Input id="roomCode" {...register('roomCode')} />
                    {errors.roomCode && <p className="text-destructive text-xs mt-1">{errors.roomCode.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="roomName">Room Name</Label>
                    <Input id="roomName" {...register('roomName')} />
                    {errors.roomName && <p className="text-destructive text-xs mt-1">{errors.roomName.message}</p>}
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
                                value={field.value || ''}
                                onSelect={field.onChange}
                                placeholder="Select a unit"
                           />
                        )}
                    />
                    {errors.unitCode && <p className="text-destructive text-xs mt-1">{errors.unitCode.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type</Label>
                    <Controller
                        name="roomType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a room type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Master Bed">Master Bed</SelectItem>
                                    <SelectItem value="Standard">Standard</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.roomType && <p className="text-destructive text-xs mt-1">{errors.roomType.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="rentAmount">Rent Amount</Label>
                        <Input id="rentAmount" type="number" {...register('rentAmount', { valueAsNumber: true })} />
                        {errors.rentAmount && <p className="text-destructive text-xs mt-1">{errors.rentAmount.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rentFrequency">Rent Frequency</Label>
                        <Controller
                            name="rentFrequency"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.rentFrequency && <p className="text-destructive text-xs mt-1">{errors.rentFrequency.message}</p>}
                    </div>
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
