
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
import { receiptBookSchema, type ReceiptBook } from './schema';
import { saveReceiptBook } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = receiptBookSchema.omit({ id: true });

interface AddReceiptBookDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    book?: ReceiptBook;
    onSuccess: () => void;
}

export function AddReceiptBookDialog({ isOpen, setIsOpen, book, onSuccess }: AddReceiptBookDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const startNo = watch('receiptStartNo');
  const endNo = watch('receiptEndNo');
  
  useEffect(() => {
    if (startNo > 0 && endNo > 0 && endNo >= startNo) {
      setValue('noOfLeafs', endNo - startNo + 1);
    } else {
      setValue('noOfLeafs', 0);
    }
  }, [startNo, endNo, setValue]);


  useEffect(() => {
    if (isOpen) {
        reset(book || {
            bookNo: '',
            receiptStartNo: 0,
            receiptEndNo: 0,
            noOfLeafs: 0,
            status: 'Active',
            leafsUsed: 0,
        });
    }
  }, [isOpen, book, reset]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    const result = await saveReceiptBook(data, book?.id);

    if (result.success) {
      toast({
        title: book ? 'Book Updated' : 'Book Added',
        description: `Receipt book has been saved successfully.`,
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
                <DialogTitle>{book ? 'Edit Receipt Book' : 'Add New Receipt Book'}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new receipt book.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                 <div className="space-y-2">
                    <Label htmlFor="bookNo">Book No.</Label>
                    <Input id="bookNo" {...register('bookNo')} />
                    {errors.bookNo && <p className="text-destructive text-xs mt-1">{errors.bookNo.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="receiptStartNo">Start No.</Label>
                        <Input id="receiptStartNo" type="number" {...register('receiptStartNo')} />
                        {errors.receiptStartNo && <p className="text-destructive text-xs mt-1">{errors.receiptStartNo.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="receiptEndNo">End No.</Label>
                        <Input id="receiptEndNo" type="number" {...register('receiptEndNo')} />
                        {errors.receiptEndNo && <p className="text-destructive text-xs mt-1">{errors.receiptEndNo.message}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="noOfLeafs">Total Leafs</Label>
                    <Input id="noOfLeafs" type="number" {...register('noOfLeafs')} disabled />
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
                                    <SelectItem value="Finished">Finished</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {book ? 'Save Changes' : 'Add Book'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
