
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { chequeBookSchema, type ChequeBook } from './schema';
import { addChequeBook, updateChequeBook } from './actions';

interface AddChequeBookDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    book?: ChequeBook;
    onSuccess: () => void;
}

const FormSchema = chequeBookSchema.omit({ id: true, leafsUsed: true });
type FormData = z.infer<typeof FormSchema>;

export function AddChequeBookDialog({ isOpen, setIsOpen, book, onSuccess }: AddChequeBookDialogProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: book ? {
            ...book,
            chequeStartNo: book.chequeStartNo || 0,
            chequeEndNo: book.chequeEndNo || 0,
            noOfLeafs: book.noOfLeafs || 0,
        } : {
            bankName: '',
            bookNo: '',
            chequeStartNo: 0,
            chequeEndNo: 0,
            noOfLeafs: 0,
            status: 'Active',
        },
    });

    useEffect(() => {
        const start = form.watch('chequeStartNo');
        const end = form.watch('chequeEndNo');
        if (end >= start) {
            form.setValue('noOfLeafs', end - start + 1);
        } else {
            form.setValue('noOfLeafs', 0);
        }
    }, [form, form.watch('chequeStartNo'), form.watch('chequeEndNo')]);
    
    const handleSubmit = async (values: FormData) => {
        try {
            if (book) {
                await updateChequeBook({ ...values, id: book.id });
            } else {
                await addChequeBook(values);
            }
            onSuccess();
            setIsOpen(false);
            form.reset();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{book ? 'Edit' : 'Add New'} Cheque Book</DialogTitle>
                    <p className="text-sm text-muted-foreground">Fill in the details for the new cheque book.</p>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bookNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Book No.</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="chequeStartNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start No.</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="chequeEndNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End No.</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="noOfLeafs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Leafs</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} readOnly className="bg-gray-100" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Finished">Finished</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button type="submit">{book ? 'Update' : 'Add'} Book</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
