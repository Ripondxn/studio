
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
import { vehicleSchema, type Vehicle } from './schema';
import { saveVehicle } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = vehicleSchema.omit({ id: true, profitOrLoss: true });

type VehicleFormData = z.infer<typeof formSchema>;

interface AddVehicleDialogProps {
    vehicle?: Vehicle;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddVehicleDialog({ vehicle, isOpen, setIsOpen, onSuccess }: AddVehicleDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
        reset(vehicle || {
            stockNo: '',
            make: '',
            model: '',
            year: new Date().getFullYear(),
            vin: '',
            purchaseDate: new Date().toISOString().split('T')[0],
            purchasePrice: 0,
            sellerInfo: '',
            saleDate: '',
            salePrice: 0,
            buyerInfo: '',
            status: 'In-stock',
            expenses: 0,
        });
    }
  }, [isOpen, vehicle, reset]);

  const onSubmit = async (data: VehicleFormData) => {
    setIsSaving(true);
    const result = await saveVehicle({ ...data, id: vehicle?.id });

    if (result.success) {
      toast({
        title: vehicle ? 'Vehicle Updated' : 'Vehicle Added',
        description: `Successfully ${vehicle ? 'updated' : 'added'} vehicle.`,
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
                <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the vehicle.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="stockNo">Stock No</Label>
                        <Input id="stockNo" {...register('stockNo')} />
                        {errors.stockNo && <p className="text-destructive text-xs mt-1">{errors.stockNo.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="make">Make</Label>
                        <Input id="make" {...register('make')} placeholder="e.g., Toyota"/>
                        {errors.make && <p className="text-destructive text-xs mt-1">{errors.make.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input id="model" {...register('model')} placeholder="e.g., Camry"/>
                        {errors.model && <p className="text-destructive text-xs mt-1">{errors.model.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" type="number" {...register('year')} />
                        {errors.year && <p className="text-destructive text-xs mt-1">{errors.year.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="vin">VIN</Label>
                        <Input id="vin" {...register('vin')} />
                    </div>
                </div>
                <div className="space-y-2">
                     <Label htmlFor="status">Status</Label>
                     <Controller name="status" control={control} render={({ field }) => (
                         <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
                             <SelectItem value="In-stock">In-stock</SelectItem>
                             <SelectItem value="Sold">Sold</SelectItem>
                             <SelectItem value="Reserved">Reserved</SelectItem>
                         </SelectContent></Select>
                     )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Purchase Details</h3>
                        <div className="space-y-2">
                            <Label htmlFor="purchaseDate">Purchase Date</Label>
                            <Input id="purchaseDate" type="date" {...register('purchaseDate')} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="purchasePrice">Purchase Price</Label>
                            <Input id="purchasePrice" type="number" {...register('purchasePrice')} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="sellerInfo">Seller Info</Label>
                            <Textarea id="sellerInfo" {...register('sellerInfo')} />
                        </div>
                    </div>
                     <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Sale Details</h3>
                         <div className="space-y-2">
                            <Label htmlFor="saleDate">Sale Date</Label>
                            <Input id="saleDate" type="date" {...register('saleDate')} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="salePrice">Sale Price</Label>
                            <Input id="salePrice" type="number" {...register('salePrice')} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="buyerInfo">Buyer Info</Label>
                            <Textarea id="buyerInfo" {...register('buyerInfo')} />
                        </div>
                    </div>
                </div>
                 <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="expenses">Additional Expenses (e.g., repairs, registration)</Label>
                    <Input id="expenses" type="number" {...register('expenses')} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {vehicle ? 'Save Changes' : 'Add Vehicle'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
