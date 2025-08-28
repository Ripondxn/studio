

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Banknote } from 'lucide-react';
import { createDepositVoucher, getLookups } from './actions';
import { format } from 'date-fns';
import { type Cheque } from './schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { useCurrency } from '@/context/currency-context';

interface DepositChequesDialogProps {
    cheques: Cheque[];
    onDeposit: () => void;
}

export function DepositChequesDialog({ cheques, onDeposit }: DepositChequesDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const [selectedChequeIds, setSelectedChequeIds] = useState<string[]>([]);
    const [depositDate, setDepositDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [bankAccountId, setBankAccountId] = useState<string>('');
    const [bankAccounts, setBankAccounts] = useState<{ value: string, label: string }[]>([]);
    const [currentUser, setCurrentUser] = useState<{ email: string, name: string, role: UserRole['role'] } | null>(null);
    const { formatCurrency } = useCurrency();

    useEffect(() => {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            setCurrentUser(JSON.parse(storedProfile));
        }
    }, []);

    useEffect(() => {
        if(isOpen) {
            getLookups().then(lookups => {
                setBankAccounts(lookups.bankAccounts || []);
                if (lookups.bankAccounts && lookups.bankAccounts.length > 0) {
                    setBankAccountId(lookups.bankAccounts[0].value);
                }
            });
        }
    }, [isOpen]);

    const selectedTotal = useMemo(() => {
        return cheques
            .filter(c => selectedChequeIds.includes(c.id))
            .reduce((sum, c) => sum + c.amount, 0);
    }, [selectedChequeIds, cheques]);

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
            toast({ variant: 'destructive', title: 'No cheques selected', description: 'Please select at least one cheque to deposit.' });
            return;
        }
        if (!bankAccountId) {
            toast({ variant: 'destructive', title: 'No bank account selected', description: 'Please select a bank account to deposit into.' });
            return;
        }
         if (!currentUser) {
            toast({ variant: 'destructive', title: 'User not found', description: 'Please log in again to perform this action.' });
            return;
        }

        setIsSaving(true);
        const result = await createDepositVoucher(selectedChequeIds, depositDate, bankAccountId, currentUser);
        if (result.success) {
            toast({ title: 'Deposit Voucher Created', description: `${result.count} cheques have been submitted for approval.` });
            onDeposit();
            setIsOpen(false);
            setSelectedChequeIds([]);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsSaving(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Banknote className="mr-2 h-4 w-4" /> + Deposit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create Bank Deposit Voucher</DialogTitle>
                    <DialogDescription>
                        Select cheques to create a deposit voucher for approval.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="depositDate">Deposit Date</Label>
                            <Input 
                                id="depositDate" 
                                type="date"
                                value={depositDate}
                                onChange={(e) => setDepositDate(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankAccount">Deposit to Bank Account</Label>
                            <Select value={bankAccountId} onValueChange={setBankAccountId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a bank account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bankAccounts.map(account => (
                                        <SelectItem key={account.value} value={account.value}>
                                            {account.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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
                        Submit For Approval
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
