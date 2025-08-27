
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { storeSchema, type Store } from './schema';
import { saveStore } from './actions';


type StoreFormData = Omit<Store, 'id'> & { id?: string };

interface AddStoreDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  store?: Store;
  onSuccess: () => void;
}

export function AddStoreDialog({ isOpen, setIsOpen, store, onSuccess }: AddStoreDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema.omit({id:true})),
  });

  useEffect(() => {
    if (isOpen) {
        reset(store || { name: '', location: '' });
    }
  }, [isOpen, store, reset]);

  const onSubmit = async (data: StoreFormData) => {
    setIsSaving(true);
    const result = await saveStore({ ...data, id: store?.id });

    if (result.success) {
      toast({
        title: store ? 'Store Updated' : 'Store Added',
        description: `Successfully ${store ? 'updated' : 'added'} store.`,
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
            <DialogTitle>{store ? 'Edit Store' : 'Add New Store'}</DialogTitle>
            <DialogDescription>
                Fill in the details for the new store or vault location.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Store Name</Label>
                    <Input id="name" {...register('name')} placeholder="e.g., Main Warehouse, Site Office A" />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...register('location')} placeholder="e.g., Dubai, UAE or Project Site B" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {store ? 'Save Changes' : 'Add Store'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
