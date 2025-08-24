

'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, FileCheck2, DollarSign } from 'lucide-react';
import { getDraftTransactions, createCheckout } from './actions';
import { type Payment } from '@/app/finance/payment/schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UserRole } from '@/app/admin/user-roles/schema';


export function AddCheckoutDialog({ onCheckoutCreated }: { onCheckoutCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [draftTransactions, setDraftTransactions] = useState<Payment[]>([]);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [currentUser, setCurrentUser] = useState<{ email: string, name: string, role: UserRole['role'] } | null>(null);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
        setCurrentUser(JSON.parse(storedProfile));
    }
  }, []);

  useEffect(() => {
      if(isOpen && currentUser) {
        setIsLoading(true);
        getDraftTransactions(currentUser)
            .then(setDraftTransactions)
            .finally(() => setIsLoading(false));
      }
  }, [isOpen, currentUser]);
  
  const selectedTotal = useMemo(() => {
    return draftTransactions
        .filter(t => selectedTransactionIds.includes(t.id!))
        .reduce((sum, t) => sum + t.amount, 0);
  }, [selectedTransactionIds, draftTransactions]);
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
        setSelectedTransactionIds(draftTransactions.map(t => t.id!));
    } else {
        setSelectedTransactionIds([]);
    }
  }

  const handleSelectRow = (id: string) => {
    setSelectedTransactionIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  const handleSubmit = async () => {
    if (selectedTransactionIds.length === 0) {
        toast({ variant: 'destructive', title: 'No Transactions Selected', description: 'Please select at least one transaction to include.' });
        return;
    }
    if (!currentUser) {
        toast({ variant: 'destructive', title: 'Error', description: 'User not found. Please log in again.'});
        return;
    }

    setIsSaving(true);
    const result = await createCheckout({
        transactionIds: selectedTransactionIds,
        user: currentUser,
        totalAmount: selectedTotal,
        notes: notes,
    });

    if (result.success) {
      toast({
        title: 'Checkout Submitted',
        description: `Voucher ${result.data?.id} has been submitted for approval.`,
      });
      setIsOpen(false);
      onCheckoutCreated();
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
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
            <DialogTitle>Create Daily Checkout</DialogTitle>
            <DialogDescription>
                Group your draft transactions into a single voucher for approval.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
             {isLoading ? (
                <div className="flex justify-center items-center h-72">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : draftTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-72 text-muted-foreground border rounded-md">
                    <FileCheck2 className="h-10 w-10 mb-4" />
                    <p>No draft transactions found to check out.</p>
                </div>
            ) : (
                <>
                    <ScrollArea className="h-72 rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox 
                                            checked={selectedTransactionIds.length === draftTransactions.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Party</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {draftTransactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell><Checkbox checked={selectedTransactionIds.includes(tx.id!)} onCheckedChange={() => handleSelectRow(tx.id!)} /></TableCell>
                                        <TableCell>{format(parseISO(tx.date), 'PP')}</TableCell>
                                        <TableCell>{tx.type}</TableCell>
                                        <TableCell>{tx.partyName}</TableCell>
                                        <TableCell>{tx.referenceNo}</TableCell>
                                        <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    <div className="flex justify-between items-center mt-2 p-4 bg-muted rounded-md">
                        <div className="text-sm">
                             <span className="text-muted-foreground">Total selected:</span>
                             <strong className="ml-2">{selectedTransactionIds.length} transaction(s)</strong>
                        </div>
                        <div className="flex items-center text-lg font-bold">
                            <DollarSign className="h-5 w-5 mr-1 text-primary" />
                             {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedTotal)}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" placeholder="Add any notes for the approver..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                </>
            )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={isSaving || isLoading || draftTransactions.length === 0}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Approval
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
