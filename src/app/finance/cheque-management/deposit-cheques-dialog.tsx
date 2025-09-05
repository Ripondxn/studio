
'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { Label } from '@/components/ui/label';
import { type Cheque } from './schema';
import { depositCheques } from './actions';
import { getBankAccounts, createDepositVoucher } from '@/app/finance/banking/actions';
import { type BankAccount } from '../banking/schema';

interface DepositChequesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cheques: Cheque[];
}

export function DepositChequesDialog({ isOpen, onClose, onSuccess, cheques }: DepositChequesDialogProps) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState<string | null>(null);
  const [depositDate, setDepositDate] = useState<Date | null>(null);

  useEffect(() => {
    if (isOpen) {
      getBankAccounts().then(setBankAccounts);
    }
  }, [isOpen]);

  const handleDeposit = async () => {
    if (selectedBankAccount && depositDate) {
      const selectedChequeIds = cheques.map(c => c.id);
      await depositCheques(selectedChequeIds, depositDate.toISOString().split('T')[0], selectedBankAccount);
      await createDepositVoucher({ 
        bankAccountId: selectedBankAccount, 
        depositDate: depositDate.toISOString().split('T')[0],
        chequeIds: selectedChequeIds
      });
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Cheques</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bank-account" className="text-right">
              Bank Account
            </Label>
            <Select onValueChange={setSelectedBankAccount}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a bank account" />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deposit-date" className="text-right">
              Deposit Date
            </Label>
            <DatePicker selected={depositDate} onSelect={setDepositDate} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDeposit} disabled={!selectedBankAccount || !depositDate}>
            Deposit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
