
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, Banknote, Landmark } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// In a real application, this data would come from a database via server actions.
const initialBankAccounts = [
    {
        id: 'acc_1',
        accountName: 'Main Operations Account',
        bankName: 'Emirates NBD',
        accountNumber: '**** **** **** 1234',
        balance: 150000.00,
        currency: 'AED'
    },
    {
        id: 'acc_2',
        accountName: 'Client Deposits Account',
        bankName: 'ADCB',
        accountNumber: '**** **** **** 5678',
        balance: 75000.00,
        currency: 'AED'
    },
    {
        id: 'acc_3',
        accountName: 'Petty Cash',
        bankName: 'Cash on Hand',
        accountNumber: 'N/A',
        balance: 5000.00,
        currency: 'AED'
    }
];

type BankAccount = typeof initialBankAccounts[0];

const BankAccountDialog = ({ account, onSave, children }: { account?: BankAccount, onSave: (data: BankAccount) => void, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState(account || {
        id: `acc_${Date.now()}`,
        accountName: '',
        bankName: '',
        accountNumber: '',
        balance: 0,
        currency: 'AED'
    });
    
    const handleSave = () => {
        if (!formData.accountName || !formData.bankName) {
            toast({ variant: 'destructive', title: 'Error', description: 'Account Name and Bank Name are required.' });
            return;
        }
        onSave(formData);
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{account ? 'Edit Bank Account' : 'Add New Bank Account'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your bank account.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="accountName">Account Nickname</Label>
                        <Input id="accountName" value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input id="accountNumber" value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="balance">Current Balance</Label>
                        <Input id="balance" type="number" value={formData.balance} onChange={(e) => setFormData({...formData, balance: Number(e.target.value)})} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave}>Save Account</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const BankAccountCard = ({ account, onEdit, onDelete }: { account: BankAccount, onEdit: (data: BankAccount) => void, onDelete: (id: string) => void }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
             <div className="flex items-center gap-4">
                 <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Landmark className="h-6 w-6" />
                 </div>
                <div>
                    <CardTitle>{account.accountName}</CardTitle>
                    <CardDescription>{account.bankName} - {account.accountNumber}</CardDescription>
                </div>
             </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                     <BankAccountDialog account={account} onSave={onEdit}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4"/> Edit
                        </DropdownMenuItem>
                    </BankAccountDialog>
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(account.id)}>
                        <Trash2 className="mr-2 h-4 w-4"/> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-3xl font-bold">
                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}
            </p>
        </CardContent>
        <CardFooter>
            <Button variant="outline" className="w-full">View Transactions</Button>
        </CardFooter>
    </Card>
);

export default function BankingPage() {
  const [accounts, setAccounts] = useState(initialBankAccounts);
  const { toast } = useToast();

  const handleSaveAccount = (data: BankAccount) => {
    setAccounts(prev => {
        const existing = prev.find(a => a.id === data.id);
        if(existing) {
            return prev.map(a => a.id === data.id ? data : a);
        }
        return [...prev, data];
    });
    toast({ title: 'Success', description: `Bank account "${data.accountName}" has been saved.`});
  };
  
  const handleDeleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    toast({ title: 'Success', description: 'Bank account has been deleted.'});
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Banking</h1>
            <p className="text-muted-foreground">
                Manage bank accounts, reconciliations, and transactions.
            </p>
        </div>
        <BankAccountDialog onSave={handleSaveAccount}>
            <Button><Plus className="mr-2 h-4 w-4"/>Add New Account</Button>
        </BankAccountDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
            <BankAccountCard key={acc.id} account={acc} onEdit={handleSaveAccount} onDelete={handleDeleteAccount} />
        ))}
      </div>
    </div>
  );
}
