
'use client';

import { useState, useEffect } from 'react';
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
import { z } from 'zod';
import { rentalSchema, type Rental } from './schema';
import { saveRental } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Combobox } from '@/components/ui/combobox';
import { getLookups } from '@/app/lookups/actions';

const formSchema = rentalSchema.omit({ id: true, partyName: true });

type RentalFormData = z.infer<typeof formSchema>;

interface AddRentalDialogProps {
    rental?: Rental;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess: () => void;
}

type Lookups = {
    vendors: { value: string, label: string }[];
    customers: { value: string, label: string }[];
}

export function AddRentalDialog({ rental, isOpen, setIsOpen, onSuccess }: AddRentalDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCode, setIsAutoCode] = useState(true);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<Lookups>({ vendors: [], customers: [] });

  const form = useForm<RentalFormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (isOpen) {
        getLookups().then(data => {
            setLookups(prev => ({
                ...prev,
                vendors: data.vendors || [],
                customers: data.customers || []
            }));
        });
        
        if(rental) {
            reset(rental);
            setIsAutoCode(false);
        } else {
            reset({
                contractNo: '',
                contractDate: new Date().toISOString().split('T')[0],
                rentalType: 'Hired',
                partyType: 'Vendor',
                partyCode: '',
                carDetails: '',
                plateNumber: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                rentalAmount: 0,
                status: 'Active',
                notes: '',
            });
            setIsAutoCode(true);
        }
    }
  }, [isOpen, rental, reset]);

  const rentalType = watch('rentalType');

  const partyOptions = rentalType === 'Hired' ? lookups.vendors : lookups.customers;

  const onSubmit = async (data: RentalFormData) => {
    setIsSaving(true);
    const selectedParty = partyOptions.find(p => p.value === data.partyCode);
    const partyName = selectedParty ? selectedParty.label : data.partyCode;

    const result = await saveRental({ 
        ...data, 
        id: rental?.id, 
        isAutoContractNo: !rental && isAutoCode,
        partyName: partyName,
        partyType: rentalType === 'Hired' ? 'Vendor' : 'Customer'
    });

    if (result.success) {
      toast({
        title: rental ? 'Agreement Updated' : 'Agreement Added',
        description: `Successfully ${rental ? 'updated' : 'added'} rental agreement.`,
      });
      onSuccess();
      setIsOpen(false);
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
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>{rental ? 'Edit Rental Agreement' : 'Add New Rental Agreement'}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the rental agreement.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contractNo">Contract No</Label>
                        <Input id="contractNo" {...register('contractNo')} disabled={isAutoCode} />
                        {errors.contractNo && <p className="text-destructive text-xs mt-1">{errors.contractNo.message}</p>}
                    </div>
                     <div className="flex items-end space-x-2 pb-1">
                        <Switch
                            id="auto-code-switch"
                            checked={isAutoCode}
                            onCheckedChange={setIsAutoCode}
                            disabled={!!rental}
                        />
                        <Label htmlFor="auto-code-switch">Auto-generate No.</Label>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contractDate">Contract Date</Label>
                        <Input id="contractDate" type="date" {...register('contractDate')} />
                        {errors.contractDate && <p className="text-destructive text-xs mt-1">{errors.contractDate.message}</p>}
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="rentalType">Rental Type</Label>
                        <Controller
                            name="rentalType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hired">Hired (From Others)</SelectItem>
                                        <SelectItem value="Rented">Rented (To Others)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="partyCode">Party</Label>
                        <Controller
                            name="partyCode"
                            control={control}
                            render={({ field }) => (
                                <Combobox
                                    options={partyOptions}
                                    value={field.value}
                                    onSelect={field.onChange}
                                    placeholder={`Select a ${rentalType === 'Hired' ? 'Vendor' : 'Customer'}`}
                                />
                            )}
                        />
                        {errors.partyCode && <p className="text-destructive text-xs mt-1">{errors.partyCode.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="carDetails">Car Details (Make, Model, Year)</Label>
                        <Input id="carDetails" {...register('carDetails')} />
                        {errors.carDetails && <p className="text-destructive text-xs mt-1">{errors.carDetails.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="plateNumber">Plate Number</Label>
                        <Input id="plateNumber" {...register('plateNumber')} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" {...register('startDate')} />
                        {errors.startDate && <p className="text-destructive text-xs mt-1">{errors.startDate.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" {...register('endDate')} />
                        {errors.endDate && <p className="text-destructive text-xs mt-1">{errors.endDate.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="rentalAmount">Rental Amount (Monthly)</Label>
                        <Input id="rentalAmount" type="number" {...register('rentalAmount')} />
                        {errors.rentalAmount && <p className="text-destructive text-xs mt-1">{errors.rentalAmount.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                         <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" {...register('notes')} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {rental ? 'Save Changes' : 'Add Agreement'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
