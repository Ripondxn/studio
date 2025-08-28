
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
import { chequeBookSchema, type ChequeBook } from './schema';
import { saveChequeBook } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = chequeBookSchema.omit({ id: true });

interface AddChequeBookDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    book?: ChequeBook;
    onSuccess: () => void;
}

export function AddChequeBookDialog({ isOpen, setIsOpen, book, onSuccess }: AddChequeBookDialogProps) {
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
  
  const startNo = watch('chequeStartNo');
  const endNo = watch('chequeEndNo');
  
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
            bankName: '',
            bookNo: '',
            chequeStartNo: 0,
            chequeEndNo: 0,
            noOfLeafs: 0,
            status: 'Active',
            leafsUsed: 0,
        });
    }
  }, [isOpen, book, reset]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    const result = await saveChequeBook(data, book?.id);

    if (result.success) {
      toast({
        title: book ? 'Book Updated' : 'Book Added',
        description: `Cheque book has been saved successfully.`,
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
                <DialogTitle>{book ? 'Edit Cheque Book' : 'Add New Cheque Book'}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new cheque book.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" {...register('bankName')} />
                    {errors.bankName && <p className="text-destructive text-xs mt-1">{errors.bankName.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="bookNo">Book No.</Label>
                    <Input id="bookNo" {...register('bookNo')} />
                    {errors.bookNo && <p className="text-destructive text-xs mt-1">{errors.bookNo.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="chequeStartNo">Start No.</Label>
                        <Input id="chequeStartNo" type="number" {...register('chequeStartNo')} />
                        {errors.chequeStartNo && <p className="text-destructive text-xs mt-1">{errors.chequeStartNo.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="chequeEndNo">End No.</Label>
                        <Input id="chequeEndNo" type="number" {...register('chequeEndNo')} />
                        {errors.chequeEndNo && <p className="text-destructive text-xs mt-1">{errors.chequeEndNo.message}</p>}
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
