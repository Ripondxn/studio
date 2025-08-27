
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
  jobId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface StockOutDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  store: Store;
  onSuccess: () => void;
}

export function StockOutDialog({ isOpen, setIsOpen, store, onSuccess }: StockOutDialogProps) {
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
        reset({ quantity: 1, productId: '', notes: '', jobId: '' });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    const result = await recordStockTransaction({
        ...data,
        storeId: store.id,
        transactionType: 'OUT',
    });

    if (result.success) {
      toast({
        title: 'Stock Issued',
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
            <DialogTitle>Stock Out: {store.name}</DialogTitle>
            <DialogDescription>
                Record items being issued from this store for a job or project.
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
                    <Label htmlFor="jobId">Job / Maintenance Ticket ID</Label>
                    <Input id="jobId" {...register('jobId')} placeholder="e.g. M-0012, Project X" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="notes">Notes / Remarks</Label>
                    <Textarea id="notes" {...register('notes')} placeholder="e.g., Issued to John Doe" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Issue Stock
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
