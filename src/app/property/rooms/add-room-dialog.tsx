

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
import { roomSchema, type Room } from './schema';
import { addRoom, getRoomLookups } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type RoomFormData = Omit<Room, 'id'>;
const roomFormSchema = roomSchema.omit({ id: true });

export function AddRoomDialog({ propertyCode, onRoomAdded }: { propertyCode: string, onRoomAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<{ units: {value: string, label: string}[] }>({ units: [] });

  useEffect(() => {
      if(isOpen) {
          getRoomLookups(propertyCode).then(setLookups);
      }
  }, [isOpen, propertyCode]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
        roomCode: '',
        propertyCode: propertyCode,
        unitCode: '',
        roomType: '',
        rentAmount: 0,
        rentFrequency: 'Monthly',
    }
  });

  const onSubmit = async (data: RoomFormData) => {
    setIsSaving(true);
    const result = await addRoom({ ...data, propertyCode });

    if (result.success) {
      toast({
        title: 'Room Added',
        description: `Successfully added new room.`,
      });
      setIsOpen(false);
      reset();
      onRoomAdded();
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
          <Plus className="mr-2 h-4 w-4" /> Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
                Fill in the details for the new room in property {propertyCode}.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="roomCode">Room Code</Label>
                    <Input id="roomCode" {...register('roomCode')} />
                    {errors.roomCode && <p className="text-destructive text-xs mt-1">{errors.roomCode.message}</p>}
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Room
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
