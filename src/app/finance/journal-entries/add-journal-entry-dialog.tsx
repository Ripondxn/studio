
'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalEntrySchema } from "./schema";
import { z } from "zod";
import { useState } from "react";
import { createJournalEntry, updateJournalEntry } from './actions';
import { type JournalEntry } from './schema';

const formSchema = journalEntrySchema.omit({ id: true });

interface AddJournalEntryDialogProps {
  accounts: { id: string; name: string }[];
  onSuccess: () => void;
  entry?: JournalEntry;
}

export function AddJournalEntryDialog({ accounts, onSuccess, entry }: AddJournalEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: entry || {},
  });

  const handleSave = async (data: z.infer<typeof formSchema>) => {
    if (entry) {
      await updateJournalEntry({ ...data, id: entry.id });
    } else {
      await createJournalEntry(data);
    }
    onSuccess();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{entry ? 'Edit' : 'Add'} Journal Entry</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{entry ? 'Edit' : 'Add'} Journal Entry</DialogTitle>
          <DialogDescription>
            {entry ? 'Update the transaction details.' : 'Record a new transaction in the general ledger.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="grid gap-4 py-4">
          <Input {...register("date")} placeholder="Date (YYYY-MM-DD)" />
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
          <Input {...register("description")} placeholder="Description" />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          <Controller
            name="debitAccount"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Debit Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.debitAccount && <p className="text-red-500">{errors.debitAccount.message}</p>}
          <Controller
            name="creditAccount"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Credit Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.creditAccount && <p className="text-red-500">{errors.creditAccount.message}</p>}
          <Input {...register("amount")} type="number" placeholder="Amount" />
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
