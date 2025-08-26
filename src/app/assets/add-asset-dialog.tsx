
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
import { z } from 'zod';
import { assetSchema, type Asset } from './schema';
import { saveAsset } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = assetSchema.omit({ id: true, currentValue: true, history: true });

type AssetFormData = z.infer<typeof formSchema>;

interface AddAssetDialogProps {
    asset?: Asset;
    onAssetAdded: () => void;
    children?: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
}

export function AddAssetDialog({ asset, onAssetAdded, children, isOpen: externalOpen, setIsOpen: setExternalOpen }: AddAssetDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen ?? internalOpen;
  const setIsOpen = setExternalOpen ?? setInternalOpen;

  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
        if(asset) {
            reset(asset);
        } else {
            reset({
                assetCode: '',
                assetName: '',
                assetType: 'Tangible',
                purchaseDate: new Date().toISOString().split('T')[0],
                purchaseCost: 0,
                depreciationMethod: 'Straight-Line',
                usefulLife: 5,
                salvageValue: 0,
                status: 'In Stock',
                assignedTo: '',
                notes: '',
            });
        }
    }
  }, [isOpen, asset, reset]);

  const onSubmit = async (data: AssetFormData) => {
    setIsSaving(true);
    const result = await saveAsset(data, asset?.id);

    if (result.success) {
      toast({
        title: asset ? 'Asset Updated' : 'Asset Added',
        description: `Successfully ${asset ? 'updated' : 'added'} asset "${data.assetName}".`,
      });
      setIsOpen(false);
      onAssetAdded();
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
      {children ? (
            <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Asset
            </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>{asset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
                <DialogDescription>
                    Fill in the details below to record a new company asset.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="assetCode">Asset Code</Label>
                        <Input id="assetCode" {...register('assetCode')} />
                        {errors.assetCode && <p className="text-destructive text-xs mt-1">{errors.assetCode.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="assetName">Asset Name</Label>
                        <Input id="assetName" {...register('assetName')} />
                        {errors.assetName && <p className="text-destructive text-xs mt-1">{errors.assetName.message}</p>}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="assetType">Asset Type</Label>
                    <Controller
                        name="assetType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tangible">Tangible</SelectItem>
                                    <SelectItem value="Intangible">Intangible</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="purchaseDate">Purchase Date</Label>
                        <Input id="purchaseDate" type="date" {...register('purchaseDate')} />
                        {errors.purchaseDate && <p className="text-destructive text-xs mt-1">{errors.purchaseDate.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="purchaseCost">Purchase Cost</Label>
                        <Input id="purchaseCost" type="number" {...register('purchaseCost', { valueAsNumber: true })} />
                        {errors.purchaseCost && <p className="text-destructive text-xs mt-1">{errors.purchaseCost.message}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Depreciation Details</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
                        <div className="space-y-2">
                            <Label htmlFor="depreciationMethod">Method</Label>
                             <Controller
                                name="depreciationMethod"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Straight-Line">Straight-Line</SelectItem>
                                            <SelectItem value="Declining Balance">Declining Balance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="usefulLife">Useful Life (Years)</Label>
                            <Input id="usefulLife" type="number" {...register('usefulLife', { valueAsNumber: true })} />
                            {errors.usefulLife && <p className="text-destructive text-xs mt-1">{errors.usefulLife.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="salvageValue">Salvage Value</Label>
                            <Input id="salvageValue" type="number" {...register('salvageValue', { valueAsNumber: true })} />
                            {errors.salvageValue && <p className="text-destructive text-xs mt-1">{errors.salvageValue.message}</p>}
                        </div>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="notes">Initial Notes</Label>
                    <Textarea id="notes" {...register('notes')} placeholder="e.g., Warranty information, initial condition..." />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {asset ? 'Save Changes' : 'Add Asset'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
