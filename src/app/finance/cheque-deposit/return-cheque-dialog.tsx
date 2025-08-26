
'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CornerUpLeft } from 'lucide-react';
import { returnCheque, getBankAccounts } from './actions';
import { format } from 'date-fns';
import { type Cheque } from './schema';
import { useCurrency } from '@/context/currency-context';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { type BankAccount } from '../banking/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type UserRole } from '@/app/admin/user-roles/schema';

interface ReturnChequeDialogProps {
    cheques: Cheque[];
    onReturn: () => void;
}

export function ReturnChequeDialog({ cheques, onReturn }: ReturnChequeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const [selectedChequeIds, setSelectedChequeIds] = useState<string[]>([]);
    const [returnWithCash, setReturnWithCash] = useState(false);
    const [paymentFrom, setPaymentFrom] = useState<'Petty Cash' | 'Bank'>('Petty Cash');
    const [bankAccountId, setBankAccountId] = useState<string | undefined>();
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [currentUser, setCurrentUser] = useState<{ email: string, name: string, role: UserRole['role'] } | null>(null);

    const { formatCurrency } = useCurrency();
    
    const selectedTotal = useMemo(() => {
        return cheques
            .filter(c => selectedChequeIds.includes(c.id))
            .reduce((sum, c) => sum + c.amount, 0);
    }, [selectedChequeIds, cheques]);
    
     useEffect(() => {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            setCurrentUser(JSON.parse(storedProfile));
        }
        if(isOpen) {
            getBankAccounts().then(setBankAccounts);
        }
    }, [isOpen]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedChequeIds(cheques.map(c => c.id));
        } else {
            setSelectedChequeIds([]);
        }
    }

    const handleSelectRow = (chequeId: string) => {
        setSelectedChequeIds(prev =>
            prev.includes(chequeId)
                ? prev.filter(id => id !== chequeId)
                : [...prev, chequeId]
        );
    }
    
    const handleSubmit = async () => {
        if (selectedChequeIds.length === 0) {
            toast({ variant: 'destructive', title: 'No cheques selected', description: 'Please select at least one cheque to return.' });
            return;
        }
        if (returnWithCash && paymentFrom === 'Bank' && !bankAccountId) {
            toast({ variant: 'destructive', title: 'Bank Account Required', description: 'Please select a bank account for the cash payment.' });
            return;
        }
         if (!currentUser) {
            toast({ variant: 'destructive', title: 'User not found', description: 'Could not identify current user.' });
            return;
        }
        
        setIsSaving(true);
        const result = await returnCheque({
            chequeIds: selectedChequeIds,
            returnWithCash,
            paymentDetails: returnWithCash ? {
                paymentFrom,
                bankAccountId,
                user: currentUser
            } : undefined
        });

        if (result.success) {
            toast({ title: 'Cheques Returned', description: `${result.count} cheques have been processed.` });
            onReturn();
            setIsOpen(false);
            setSelectedChequeIds([]);
            setReturnWithCash(false);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsSaving(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <CornerUpLeft className="mr-2 h-4 w-4" /> - Return Cheque
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Return Cheque</DialogTitle>
                    <DialogDescription>
                        Select the cheques you want to mark as returned to the party.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="space-y-4 rounded-lg border p-4">
                        <div className="flex items-center space-x-2">
                           <Switch
                                id="return-with-cash"
                                checked={returnWithCash}
                                onCheckedChange={setReturnWithCash}
                            />
                            <Label htmlFor="return-with-cash" className="text-base font-semibold">
                                Return with Cash?
                            </Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            If you are giving cash back to the tenant/customer in exchange for the cheque, enable this option. A payment voucher will be created for approval.
                        </p>
                        {returnWithCash && (
                             <div className="grid grid-cols-2 gap-4 pt-2">
                                <Select value={paymentFrom} onValueChange={(value: 'Petty Cash' | 'Bank') => setPaymentFrom(value)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Petty Cash">From Petty Cash</SelectItem>
                                        <SelectItem value="Bank">From Bank</SelectItem>
                                    </SelectContent>
                                </Select>
                                {paymentFrom === 'Bank' && (
                                     <Select value={bankAccountId} onValueChange={setBankAccountId}>
                                        <SelectTrigger><SelectValue placeholder="Select Bank Account..." /></SelectTrigger>
                                        <SelectContent>
                                            {bankAccounts.map(acc => (
                                                <SelectItem key={acc.id} value={acc.id}>{acc.accountName} ({acc.bankName})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        )}
                    </div>
                    <ScrollArea className="h-72 rounded-md border">
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox 
                                            checked={selectedChequeIds.length === cheques.length && cheques.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Cheque No</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Party Name</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cheques.map(cheque => (
                                    <TableRow key={cheque.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedChequeIds.includes(cheque.id)}
                                                onCheckedChange={() => handleSelectRow(cheque.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{cheque.chequeNo}</TableCell>
                                        <TableCell>{format(new Date(cheque.chequeDate), 'PP')}</TableCell>
                                        <TableCell>{cheque.partyName}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(cheque.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    <div className="flex justify-end font-bold">
                        Total Selected: {formatCurrency(selectedTotal)}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                     <Button onClick={handleSubmit} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Return
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
