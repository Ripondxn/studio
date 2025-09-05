
'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { withdrawCheques } from './actions';
import { type Cheque } from './schema';

const withdrawSchema = z.object({
    chequeIds: z.array(z.string()).min(1, 'Please select at least one cheque to withdraw.'),
});

type WithdrawFormData = z.infer<typeof withdrawSchema>;

interface WithdrawChequesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    cheques: Cheque[];
}

export function WithdrawChequesDialog({ isOpen, onClose, onSuccess, cheques }: WithdrawChequesDialogProps) {
    const { toast } = useToast();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<WithdrawFormData>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: { chequeIds: [] },
    });

    const onSubmit = async (data: WithdrawFormData) => {
        const result = await withdrawCheques(data.chequeIds);
        if (result.success) {
            toast({ title: 'Success', description: 'Selected cheques have been withdrawn.' });
            onSuccess();
            onClose();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Withdraw Cheques</DialogTitle>
                        <DialogDescription>Select cheques to mark as withdrawn. This is for internal bookkeeping and does not affect bank records.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Controller
                            name="chequeIds"
                            control={control}
                            render={({ field }) => (
                                <ScrollArea className="h-64">
                                    <div className="space-y-2">
                                        {cheques.map((cheque) => (
                                            <div key={cheque.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={cheque.id}
                                                    checked={field.value.includes(cheque.id)}
                                                    onCheckedChange={(checked) => {
                                                        const newValue = checked
                                                            ? [...field.value, cheque.id]
                                                            : field.value.filter((id) => id !== cheque.id);
                                                        field.onChange(newValue);
                                                    }}
                                                />
                                                <Label htmlFor={cheque.id} className="flex justify-between w-full">
                                                    <span>{cheque.chequeNo} - {cheque.partyName}</span>
                                                    <span>{cheque.amount}</span>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        />
                        {errors.chequeIds && <p className="text-destructive text-sm mt-2">{errors.chequeIds.message}</p>}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Withdraw
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
