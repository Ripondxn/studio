
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRightLeft } from 'lucide-react';
import { getTransactionsForAccount } from './actions';
import { type Account } from './schema';
import { type Payment } from '../payment/schema';
import { cn } from '@/lib/utils';

export function TransactionHistoryDialog({ account, children }: { account: Account, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getTransactionsForAccount(account.code)
        .then(setTransactions)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, account.code]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Transaction History: {account.name} ({account.code})</DialogTitle>
          <DialogDescription>
            Showing all recorded transactions contributing to this account's balance.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
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
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>{format(new Date(tx.date), 'PP')}</TableCell>
                    <TableCell>
                      <Badge variant={tx.type === 'Receipt' ? 'secondary' : 'outline'} className={cn(tx.type === 'Receipt' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'border-transparent')}>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{tx.partyName}</TableCell>
                    <TableCell>{tx.referenceNo}</TableCell>
                    <TableCell className={cn("text-right font-medium", tx.type === 'Receipt' ? 'text-green-600' : 'text-red-600')}>
                      {tx.type === 'Receipt' ? '+' : '-'}
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
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
