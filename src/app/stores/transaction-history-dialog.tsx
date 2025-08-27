
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
import { Loader2, ArrowDown, ArrowUp, Printer, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { type StockTransaction } from './schema';
import { getTransactionHistory, deleteStockTransaction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


interface TransactionHistoryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function TransactionHistoryDialog({ isOpen, setIsOpen }: TransactionHistoryDialogProps) {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole['role'] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setIsLoading(true);
    const data = await getTransactionHistory();
    setTransactions(data);
    setIsLoading(false);
  }

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
        setCurrentUserRole(JSON.parse(storedProfile).role);
    }
    if (isOpen) {
        fetchHistory();
    }
  }, [isOpen]);
  
  const handleDelete = async () => {
    if (!selectedTxId) return;
    setIsDeleting(true);
    const result = await deleteStockTransaction(selectedTxId);
    if (result.success) {
        toast({title: 'Success', description: 'Transaction has been deleted and financials reversed.'});
        fetchHistory(); // Refresh list
    } else {
        toast({variant: 'destructive', title: 'Error', description: result.error});
    }
    setIsDeleting(false);
    setSelectedTxId(null);
  }

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (printContent) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Stock Transaction History</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } h1 { text-align: center; } .no-print { display: none; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>Stock Transaction History</h1>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
       <AlertDialog open={!!selectedTxId} onOpenChange={(open) => !open && setSelectedTxId(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete the transaction and reverse its financial impact. This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
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
                            {currentUserRole === 'Super Admin' && <TableHead className="text-right no-print">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin"/>
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">No transactions yet.</TableCell>
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
                                     {currentUserRole === 'Super Admin' && (
                                        <TableCell className="text-right no-print">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem disabled>
                                                        <Edit className="mr-2 h-4 w-4"/> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onSelect={() => setSelectedTxId(tx.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4"/> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
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
