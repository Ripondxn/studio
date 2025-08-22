
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { format, isBefore, isAfter, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, FileText, FileSpreadsheet, Trash2 } from 'lucide-react';
import { getPaymentsForAgent } from './actions';
import { deletePayment } from '@/app/finance/payment/actions';
import { type Agent } from './schema';
import { type Payment } from '@/app/finance/payment/schema';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Extend jsPDF type to include autoTable from the plugin
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

interface TransactionHistoryDialogProps {
  agent: Agent;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function TransactionHistoryDialog({ agent, isOpen, setIsOpen }: TransactionHistoryDialogProps) {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const { toast } = useToast();
  const [filters, setFilters] = useState({ fromDate: '', toDate: '' });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
        if (filters.fromDate && isBefore(parseISO(tx.date), parseISO(filters.fromDate))) return false;
        if (filters.toDate && isAfter(parseISO(tx.date), parseISO(filters.toDate))) return false;
        return true;
    });
  }, [transactions, filters]);


  const fetchTransactions = useCallback(() => {
      setIsLoading(true);
      getPaymentsForAgent(agent.code)
        .then(setTransactions)
        .finally(() => setIsLoading(false));
  }, [agent.code]);

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen, fetchTransactions]);

  const handleDeletePayment = async () => {
    if(!selectedTxId) return;
    setIsDeleting(true);
    const result = await deletePayment(selectedTxId);
    if(result.success) {
      toast({ title: 'Success', description: 'Commission payment has been deleted.' });
      fetchTransactions(); // Refresh the list
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to delete transaction.' });
    }
    setIsDeleting(false);
    setSelectedTxId(null);
  }

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Commission History: ${agent.name}`, 14, 16);
    
    const head = [['Date', 'Property', 'Unit', 'Room', 'Partition', 'Reference', 'Amount']];
    const body = filteredTransactions.map(tx => [
        format(new Date(tx.date), 'PP'),
        tx.property || 'N/A',
        tx.unitCode || 'N/A',
        tx.roomCode || 'N/A',
        tx.partitionCode || 'N/A',
        tx.referenceNo,
        `-${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}`
    ]);

    (doc as any).autoTable({
        head: head,
        body: body,
        startY: 22,
    });

    doc.save(`commission-history-${agent.code}.pdf`);
  };

  const handleExportExcel = () => {
    const dataToExport = filteredTransactions.map(tx => ({
        'Date': format(new Date(tx.date), 'PP'),
        'Property': tx.property || 'N/A',
        'Unit': tx.unitCode || 'N/A',
        'Room': tx.roomCode || 'N/A',
        'Partition': tx.partitionCode || 'N/A',
        'Reference': tx.referenceNo,
        'Amount': -tx.amount,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Commission History");
    XLSX.writeFile(wb, `commission-history-${agent.code}.xlsx`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
         <AlertDialog open={!!selectedTxId} onOpenChange={(open) => !open && setSelectedTxId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete the commission payment and reverse its financial impact. This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePayment} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Commission History: {agent.name}</DialogTitle>
              <DialogDescription>
                Showing all recorded commission payments for this agent.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b">
            <div>
                <Label htmlFor="fromDate-agent">From Date</Label>
                <Input id="fromDate-agent" type="date" value={filters.fromDate} onChange={e => handleFilterChange('fromDate', e.target.value)} />
            </div>
            <div>
                <Label htmlFor="toDate-agent">To Date</Label>
                <Input id="toDate-agent" type="date" value={filters.toDate} onChange={e => handleFilterChange('toDate', e.target.value)} />
            </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No commission payments found for this agent.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Partition</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>{format(new Date(tx.date), 'PP')}</TableCell>
                    <TableCell>{tx.property || 'N/A'}</TableCell>
                    <TableCell>{tx.unitCode || 'N/A'}</TableCell>
                    <TableCell>{tx.roomCode || 'N/A'}</TableCell>
                    <TableCell>{tx.partitionCode || 'N/A'}</TableCell>
                    <TableCell>{tx.referenceNo}</TableCell>
                    <TableCell className={cn("text-right font-medium", 'text-red-600')}>
                      -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
                    </TableCell>
                     <TableCell className="text-right">
                         <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setSelectedTxId(tx.id)}>
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
