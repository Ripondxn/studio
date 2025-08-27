
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
import { getProductsForSelect, transferStock } from './actions';
import { type Store } from './schema';
import { Combobox } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  fromStoreId: z.string().min(1, 'Source store is required'),
  toStoreId: z.string().min(1, 'Destination store is required'),
  productId: z.string().min(1, 'Please select a product.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  notes: z.string().optional(),
}).refine(data => data.fromStoreId !== data.toStoreId, {
    message: "Source and destination stores cannot be the same.",
    path: ['toStoreId'],
});

type FormData = z.infer<typeof formSchema>;

interface StockTransferDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  stores: Store[];
  onSuccess: () => void;
}

export function StockTransferDialog({ isOpen, setIsOpen, stores, onSuccess }: StockTransferDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<{value: string, label: string}[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { quantity: 1 }
  });

  useEffect(() => {
    if (isOpen) {
        getProductsForSelect().then(setProducts);
        reset({ quantity: 1, productId: '', notes: '', fromStoreId: '', toStoreId: '' });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    const result = await transferStock(data);

    if (result.success) {
      toast({
        title: 'Stock Transferred',
        description: 'Inventory has been updated successfully.',
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
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Transfer Stock Between Stores</DialogTitle>
            <DialogDescription>
                Move items from one inventory location to another.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>From Store</Label>
                         <Controller
                            name="fromStoreId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select Source"/></SelectTrigger>
                                    <SelectContent>
                                        {stores.map(store => <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.fromStoreId && <p className="text-destructive text-xs mt-1">{errors.fromStoreId.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label>To Store</Label>
                         <Controller
                            name="toStoreId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select Destination"/></SelectTrigger>
                                    <SelectContent>
                                        {stores.map(store => <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.toStoreId && <p className="text-destructive text-xs mt-1">{errors.toStoreId.message}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="productId">Product / Service</Label>
                     <Controller
                        name="productId"
                        control={control}
                        render={({ field }) => (
                           <Combobox
                                options={products}
                                value={field.value || ''}
                                onSelect={field.onChange}
                                placeholder="Select an item"
                           />
                        )}
                    />
                    {errors.productId && <p className="text-destructive text-xs mt-1">{errors.productId.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" {...register('quantity')} />
                    {errors.quantity && <p className="text-destructive text-xs mt-1">{errors.quantity.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="notes">Notes / Reference</Label>
                    <Textarea id="notes" {...register('notes')} placeholder="e.g., Transfer for Project X" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Transfer
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
