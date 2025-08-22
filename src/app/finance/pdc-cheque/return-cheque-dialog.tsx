
'use client';

import { useState, useMemo } from 'react';
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
import { returnPdcCheque } from './actions';
import { format } from 'date-fns';
import { type PdcCheque } from './schema';

interface ReturnChequeDialogProps {
    cheques: PdcCheque[];
    onReturn: () => void;
}

export function ReturnChequeDialog({ cheques, onReturn }: ReturnChequeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const [selectedChequeIds, setSelectedChequeIds] = useState<string[]>([]);
    
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
            toast({ variant: 'destructive', title: 'No cheques selected', description: 'Please select at least one cheque to return.' });
            return;
        }
        
        setIsSaving(true);
        const result = await returnPdcCheque(selectedChequeIds);
        if (result.success) {
            toast({ title: 'Cheques Returned', description: `${result.count} cheques have been marked as returned.` });
            onReturn();
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
                                        <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cheque.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    <div className="flex justify-end font-bold">
                        Total Selected: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedTotal)}
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
