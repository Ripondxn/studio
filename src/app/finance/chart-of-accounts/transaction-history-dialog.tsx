
'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, FileText, FileSpreadsheet } from 'lucide-react';
import { getTransactionsForAccount } from './actions';
import { deleteEquityTransaction } from '../equity/actions';
import { type Account } from './schema';
import { type Payment } from '../payment/schema';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Extend jsPDF type to include autoTable from the plugin
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}


export function TransactionHistoryDialog({ account, children }: { account: Account, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const { toast } = useToast();
  const [filters, setFilters] = useState({ fromDate: '', toDate: '', type: 'all', party: '' });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
        if (filters.fromDate && isBefore(parseISO(tx.date), parseISO(filters.fromDate))) return false;
        if (filters.toDate && isAfter(parseISO(tx.date), parseISO(filters.toDate))) return false;
        if (filters.type !== 'all' && tx.type !== filters.type) return false;
        if (filters.party && !tx.partyName.toLowerCase().includes(filters.party.toLowerCase())) return false;
        return true;
    });
  }, [transactions, filters]);

  const fetchTransactions = () => {
      setIsLoading(true);
      getTransactionsForAccount(account.code)
        .then(setTransactions)
        .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen, account.code]);

  const handleDeleteEquity = async () => {
    if(!selectedTxId) return;
    setIsDeleting(true);
    const result = await deleteEquityTransaction(selectedTxId);
    if(result.success) {
      toast({ title: 'Success', description: 'Equity transaction has been deleted.' });
      fetchTransactions(); // Refresh the list
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to delete transaction.' });
    }
    setIsDeleting(false);
    setSelectedTxId(null);
  }

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Transaction History: ${account.name} (${account.code})`, 14, 16);
    
    const head = [['Date', 'Type', 'Party', 'Property', 'Unit', 'Room', 'Partition', 'Reference', 'Amount']];
    const body = filteredTransactions.map(tx => [
        format(new Date(tx.date), 'PP'),
        tx.type,
        tx.partyName,
        tx.property || 'N/A',
        tx.unitCode || 'N/A',
        tx.roomCode || 'N/A',
        tx.partitionCode || 'N/A',
        tx.referenceNo,
        `${tx.type === 'Receipt' ? '+' : '-'}${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}`
    ]);

    (doc as any).autoTable({
        head: head,
        body: body,
        startY: 22,
    });

    doc.save(`transactions-${account.code}.pdf`);
  };

  const handleExportExcel = () => {
    const dataToExport = filteredTransactions.map(tx => ({
        'Date': format(new Date(tx.date), 'PP'),
        'Type': tx.type,
        'Party': tx.partyName,
        'Property': tx.property || 'N/A',
        'Unit': tx.unitCode || 'N/A',
        'Room': tx.roomCode || 'N/A',
        'Partition': tx.partitionCode || 'N/A',
        'Reference': tx.referenceNo,
        'Amount': (tx.type === 'Receipt' ? 1 : -1) * tx.amount,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `transactions-${account.code}.xlsx`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
         <AlertDialog open={!!selectedTxId} onOpenChange={(open) => !open && setSelectedTxId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete the equity transaction and reverse its financial impact. This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteEquity} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Transaction History: {account.name} ({account.code})</DialogTitle>
              <DialogDescription>
                Showing all recorded transactions contributing to this account's balance.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b">
            <div>
                <Label htmlFor="fromDate-coa">From Date</Label>
                <Input id="fromDate-coa" type="date" value={filters.fromDate} onChange={e => handleFilterChange('fromDate', e.target.value)} />
            </div>
            <div>
                <Label htmlFor="toDate-coa">To Date</Label>
                <Input id="toDate-coa" type="date" value={filters.toDate} onChange={e => handleFilterChange('toDate', e.target.value)} />
            </div>
            <div>
                <Label htmlFor="type-coa">Type</Label>
                <Select value={filters.type} onValueChange={value => handleFilterChange('type', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Receipt">Receipt</SelectItem>
                        <SelectItem value="Payment">Payment</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="party-coa">Party Name</Label>
                <Input id="party-coa" placeholder="Filter by party..." value={filters.party} onChange={e => handleFilterChange('party', e.target.value)} />
            </div>
        </div>
        
        <div className="max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No transactions found for this account.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Partition</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  {account.code === '3000' && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>{format(new Date(tx.date), 'PP')}</TableCell>
                    <TableCell>
                      <Badge variant={tx.type === 'Receipt' ? 'secondary' : 'outline'} className={cn(tx.type === 'Receipt' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'border-transparent')}>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{tx.partyName}</TableCell>
                    <TableCell>{tx.property || 'N/A'}</TableCell>
                    <TableCell>{tx.unitCode || 'N/A'}</TableCell>
                    <TableCell>{tx.roomCode || 'N/A'}</TableCell>
                    <TableCell>{tx.partitionCode || 'N/A'}</TableCell>
                    <TableCell>{tx.referenceNo}</TableCell>
                    <TableCell className={cn("text-right font-medium", tx.type === 'Receipt' ? 'text-green-600' : 'text-red-600')}>
                      {tx.type === 'Receipt' ? '+' : '-'}
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
                    </TableCell>
                    {account.code === '3000' && (
                      <TableCell className="text-right">
                         <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setSelectedTxId(tx.id)}>
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </TableCell>
                    )}
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
