
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
import { productSchema, type Product } from './schema';
import { saveProduct, getNextItemCode } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const formSchema = productSchema.omit({ id: true });

type ProductFormData = z.infer<typeof formSchema>;

interface AddProductDialogProps {
    product?: Product;
    onProductAdded: () => void;
    children?: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
}

export function AddProductDialog({ product, onProductAdded, children, isOpen: externalOpen, setIsOpen: setExternalOpen }: AddProductDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen ?? internalOpen;
  const setIsOpen = setExternalOpen ?? setInternalOpen;

  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCode, setIsAutoCode] = useState(true);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const initializeForm = async () => {
        if (product) {
            reset(product);
            setIsAutoCode(false); // When editing, code is always manual
        } else {
            const nextCode = await getNextItemCode();
            reset({
                itemCode: nextCode,
                itemName: '',
                itemType: 'Product',
                salePrice: 0,
                costPrice: 0,
            });
            setIsAutoCode(true);
        }
    }
    if (isOpen) {
        initializeForm();
    }
  }, [isOpen, product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    const result = await saveProduct(data, product?.id, !product && isAutoCode);

    if (result.success) {
      toast({
        title: product ? 'Item Updated' : 'Item Added',
        description: `Successfully ${product ? 'updated' : 'added'} item "${data.itemName}".`,
      });
      setIsOpen(false);
      onProductAdded();
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
                <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>{product ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                <DialogDescription>
                    Fill in the details for your product or service.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="itemCode">Item Code</Label>
                        <Input id="itemCode" {...register('itemCode')} disabled={isAutoCode} />
                        {errors.itemCode && <p className="text-destructive text-xs mt-1">{errors.itemCode.message}</p>}
                    </div>
                     <div className="flex items-end space-x-2 pb-1">
                        <Switch
                            id="auto-code-switch"
                            checked={isAutoCode}
                            onCheckedChange={setIsAutoCode}
                            disabled={!!product}
                        />
                        <Label htmlFor="auto-code-switch">Auto-generate Code</Label>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input id="itemName" {...register('itemName')} />
                    {errors.itemName && <p className="text-destructive text-xs mt-1">{errors.itemName.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="itemType">Item Type</Label>
                    <Controller
                        name="itemType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Product">Product</SelectItem>
                                    <SelectItem value="Service">Service</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="salePrice">Sale Price</Label>
                        <Input id="salePrice" type="number" {...register('salePrice', { valueAsNumber: true })} />
                        {errors.salePrice && <p className="text-destructive text-xs mt-1">{errors.salePrice.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="costPrice">Cost Price</Label>
                        <Input id="costPrice" type="number" {...register('costPrice', { valueAsNumber: true })} />
                        {errors.costPrice && <p className="text-destructive text-xs mt-1">{errors.costPrice.message}</p>}
                    </div>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {product ? 'Save Changes' : 'Add Item'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
