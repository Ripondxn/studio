
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
import { Loader2, Move } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getContractLookups, getUnitsForProperty, getRoomsForUnit, moveTenant } from '../../contract/actions';
import { Combobox } from '@/components/ui/combobox';
import { format } from 'date-fns';

const formSchema = z.object({
  newPropertyCode: z.string().min(1, "Please select a property."),
  newUnitCode: z.string().min(1, "Please select a unit."),
  newRoomCode: z.string().optional(),
  moveDate: z.string().min(1, "Please select a move date."),
});

type MoveTenantFormData = z.infer<typeof formSchema>;

interface MoveTenantDialogProps {
  contractId: string;
  currentLocation: {
    property: string;
    unit: string;
    room?: string;
  }
}

type Lookups = {
    properties: {value: string, label: string}[];
    units: {value: string, label: string}[];
    rooms: {value: string, label: string}[];
}

export function MoveTenantDialog({ contractId, currentLocation }: MoveTenantDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<Lookups>({ properties: [], units: [], rooms: [] });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MoveTenantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        moveDate: format(new Date(), 'yyyy-MM-dd'),
    }
  });
  
  const watchedProperty = watch('newPropertyCode');
  const watchedUnit = watch('newUnitCode');

  useEffect(() => {
    if(isOpen) {
        getContractLookups().then(data => setLookups(prev => ({...prev, properties: data.properties })));
    }
  }, [isOpen]);
  
  useEffect(() => {
    const fetchUnits = async () => {
        if(watchedProperty) {
            const unitsData = await getUnitsForProperty(watchedProperty);
            setLookups(prev => ({...prev, units: unitsData, rooms: []}));
        }
    }
    fetchUnits();
  }, [watchedProperty]);
  
   useEffect(() => {
    const fetchRooms = async () => {
        if(watchedProperty && watchedUnit) {
            const roomsData = await getRoomsForUnit(watchedProperty, watchedUnit);
            setLookups(prev => ({...prev, rooms: roomsData}));
        }
    }
    fetchRooms();
  }, [watchedProperty, watchedUnit]);

  const onSubmit = async (data: MoveTenantFormData) => {
    setIsSaving(true);
    const result = await moveTenant({ ...data, contractId });

    if (result.success) {
      toast({ title: "Tenant Moved", description: "The tenant's contract has been updated with the new location." });
      setIsOpen(false);
      // It's best to rely on a page refresh to get all new state.
      window.location.reload();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Moving Tenant',
        description: result.error,
      });
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Move className="h-4 w-4" />
          <span className="sr-only">Move Tenant</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Move Tenant to New Unit</DialogTitle>
            <DialogDescription>
              Select the new location for the tenant. The current contract will be updated.
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="p-2 border rounded-md bg-muted text-sm">
                    <p><strong>Current Location:</strong> {currentLocation.property} / {currentLocation.unit} {currentLocation.room && `/ ${currentLocation.room}`}</p>
                </div>
                <div className="space-y-2">
                    <Label>New Property</Label>
                    <Controller
                        name="newPropertyCode"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                options={lookups.properties}
                                value={field.value || ''}
                                onSelect={(value) => {
                                    field.onChange(value);
                                    setValue('newUnitCode', '');
                                    setValue('newRoomCode', '');
                                }}
                                placeholder="Select New Property"
                            />
                        )}
                    />
                     {errors.newPropertyCode && <p className="text-destructive text-sm mt-1">{errors.newPropertyCode.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label>New Unit</Label>
                    <Controller
                        name="newUnitCode"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                options={lookups.units}
                                value={field.value || ''}
                                onSelect={(value) => {
                                    field.onChange(value);
                                    setValue('newRoomCode', '');
                                }}
                                placeholder="Select New Unit"
                                disabled={!watchedProperty}
                            />
                        )}
                    />
                     {errors.newUnitCode && <p className="text-destructive text-sm mt-1">{errors.newUnitCode.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label>New Room (Optional)</Label>
                    <Controller
                        name="newRoomCode"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                options={lookups.rooms}
                                value={field.value || ''}
                                onSelect={field.onChange}
                                placeholder="Select New Room"
                                disabled={!watchedUnit || lookups.rooms.length === 0}
                            />
                        )}
                    />
                </div>
                 <div className="space-y-2">
                    <Label>Movement Date</Label>
                    <Input type="date" {...register('moveDate')} />
                     {errors.moveDate && <p className="text-destructive text-sm mt-1">{errors.moveDate.message}</p>}
                 </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Move
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
