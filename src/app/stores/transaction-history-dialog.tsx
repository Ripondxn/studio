
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowDown, ArrowUp, Printer } from 'lucide-react';
import { type StockTransaction } from './schema';
import { getTransactionHistory } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface TransactionHistoryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function TransactionHistoryDialog({ isOpen, setIsOpen }: TransactionHistoryDialogProps) {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        setIsLoading(true);
        getTransactionHistory()
            .then(setTransactions)
            .finally(() => setIsLoading(false));
    }
  }, [isOpen]);
  
  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (printContent) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Stock Transaction History</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } h1 { text-align: center; } .no-print { display: none; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>Stock Transaction History</h1>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
            <DialogTitle>Stock Transaction History</DialogTitle>
            <DialogDescription>
                A log of all inventory movements across all stores.
            </DialogDescription>
            </DialogHeader>
             <div className="grid gap-4 py-4">
               <ScrollArea className="h-96 rounded-md border" ref={printRef}>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Store</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead>Notes/Job</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin"/>
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">No transactions yet.</TableCell>
                            </TableRow>
                        ) : (
                            transactions.slice().reverse().map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>{format(new Date(tx.date), 'PP p')}</TableCell>
                                    <TableCell>{tx.storeName}</TableCell>
                                    <TableCell>{tx.productName}</TableCell>
                                    <TableCell className={cn("text-right font-medium flex items-center justify-end gap-1", tx.type === 'IN' ? 'text-green-600' : 'text-red-600')}>
                                        {tx.type === 'IN' ? <ArrowDown className="h-4 w-4"/> : <ArrowUp className="h-4 w-4"/>}
                                        {tx.quantity}
                                    </TableCell>
                                    <TableCell>{tx.jobId || tx.notes}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                 </Table>
               </ScrollArea>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Close</Button>
                </DialogClose>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
