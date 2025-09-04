
'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalEntrySchema, Account } from "./data";
import { z } from "zod";
import { useState } from "react";

const formSchema = journalEntrySchema.omit({ id: true, status: true });

interface AddJournalEntryDialogProps {
  accounts: Account[];
  onSave: (data: z.infer<typeof formSchema>) => void;
}

export function AddJournalEntryDialog({ accounts, onSave }: AddJournalEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const handleSave = (data: z.infer<typeof formSchema>) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Journal Entry</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Journal Entry</DialogTitle>
          <DialogDescription>
            Record a new transaction in the general ledger.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="grid gap-4 py-4">
          <Input {...register("date")} placeholder="Date (YYYY-MM-DD)" />
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
          <Input {...register("description")} placeholder="Description" />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          <Controller
            name="debitAccountId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Debit Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.debitAccountId && <p className="text-red-500">{errors.debitAccountId.message}</p>}
          <Controller
            name="creditAccountId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Credit Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.creditAccountId && <p className="text-red-500">{errors.creditAccountId.message}</p>}
          <Input {...register("amount", { valueAsNumber: true })} type="number" placeholder="Amount" />
          {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!isValid}>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
