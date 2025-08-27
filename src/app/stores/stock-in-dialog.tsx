
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
import { getProductsForSelect, recordStockTransaction } from './actions';
import { type Store } from './schema';
import { Combobox } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';


const formSchema = z.object({
  productId: z.string().min(1, 'Please select a product.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface StockInDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  store: Store;
  onSuccess: () => void;
}

export function StockInDialog({ isOpen, setIsOpen, store, onSuccess }: StockInDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<{value: string, label: string}[]>([]);
  const { toast } = useToast();

  const {
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
        reset({ quantity: 1, productId: '', notes: '' });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    const result = await recordStockTransaction({
        ...data,
        storeId: store.id,
        transactionType: 'IN',
    });

    if (result.success) {
      toast({
        title: 'Stock Added',
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
            <DialogTitle>Stock In: {store.name}</DialogTitle>
            <DialogDescription>
                Record new items being added to this store's inventory.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                    <Textarea id="notes" {...register('notes')} placeholder="e.g., PO #123, Initial stock" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Stock
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
