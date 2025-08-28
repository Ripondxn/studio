

'use client';

import { useState, useMemo, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Banknote, Trash2, CheckCircle, XCircle, Hourglass, Calendar, Library, Landmark, Building2, User, CornerUpLeft } from 'lucide-react';
import { format, isBefore, startOfToday, parseISO } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateChequeStatus, deleteCheque, getBankAccounts } from './actions';
import { Cheque } from './schema';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { useCurrency } from '@/context/currency-context';
import { type BankAccount } from '../banking/schema';


const statusConfig: {
  [key in Cheque['status']]: {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: React.ReactNode;
    className?: string;
  };
} = {
  'In Hand': { variant: 'secondary', icon: <Hourglass className="h-3 w-3" /> },
  'Deposited': { variant: 'default', icon: <Banknote className="h-3 w-3" />, className: 'bg-blue-500/20 text-blue-700 border-transparent hover:bg-blue-500/30' },
  'Cleared': { variant: 'outline', icon: <CheckCircle className="h-3 w-3" />, className: 'bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30' },
  'Bounced': { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
  'Cancelled': { variant: 'destructive', icon: <XCircle className="h-3 w-3" />, className: 'bg-gray-500/20 text-gray-700 border-transparent hover:bg-gray-500/30' },
  'Returned': { variant: 'destructive', icon: <CornerUpLeft className="h-3 w-3" />, className: 'bg-orange-500/20 text-orange-700 border-transparent hover:bg-orange-500/30' },
  'Returned with Cash': { variant: 'destructive', icon: <CornerUpLeft className="h-3 w-3" />, className: 'bg-purple-500/20 text-purple-700 border-transparent hover:bg-purple-500/30' },
};


const UpdateStatusDialog = ({ cheque, onUpdate }: { cheque: Cheque, onUpdate: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<Cheque['status']>(cheque.status);
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [bankAccountId, setBankAccountId] = useState(cheque.bankAccountId || '');
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const { toast } = useToast();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: UserRole['role'] } | null>(null);

    useEffect(() => {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            setCurrentUser(JSON.parse(storedProfile));
        }
        if(isOpen) {
            getBankAccounts().then(setBankAccounts);
        }
    }, [isOpen]);

    const handleUpdate = async () => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not identify current user. Please log in again.'});
            return;
        }
        if ((status === 'Deposited' || status === 'Cleared' || status === 'Returned with Cash') && !bankAccountId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a bank account.'});
            return;
        }

        const result = await updateChequeStatus(cheque.id, status, date, currentUser, bankAccountId);
        if (result.success) {
            toast({ title: 'Status Updated', description: `Cheque ${cheque.chequeNo} status updated to ${status}. A new entry may have been created in the workflow for approval.` });
            onUpdate();
            setIsOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    };
    
    const relevantDateLabel = useMemo(() => {
        if (status === 'Deposited') return 'Deposit Date';
        if (status === 'Cleared') return 'Clearance Date';
        if (status === 'Bounced') return 'Bounce Date';
        if (status === 'Returned with Cash') return 'Return Date';
        return null;
    }, [status]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DialogTrigger asChild><div className="w-full flex items-center"><Pencil className="mr-2 h-4 w-4" /> Update Status</div></DialogTrigger>
            </DropdownMenuItem>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Status for Cheque #{cheque.chequeNo}</DialogTitle>
                    <DialogDescription>Select the new status and relevant date.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">New Status</Label>
                        <Select onValueChange={(value: Cheque['status']) => setStatus(value)} value={status}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(statusConfig).map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {relevantDateLabel && (
                         <div className="space-y-2">
                            <Label htmlFor="date">{relevantDateLabel}</Label>
                            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                    )}
                     {(status === 'Deposited' || status === 'Cleared' || status === 'Returned with Cash') && (
                         <div className="space-y-2">
                            <Label htmlFor="bankAccount">{status === 'Returned with Cash' ? 'Cash From' : 'Deposit to'} Bank Account</Label>
                            <Select onValueChange={setBankAccountId} value={bankAccountId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a bank" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bankAccounts.map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>{acc.accountName} ({acc.bankName})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleUpdate}>Update Status</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const ActionsCell = ({ row }: { row: { original: Cheque } }) => {
    const router = useRouter();
    const cheque = row.original;
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteCheque(cheque.id);
        if (result.success) {
            toast({
                title: 'Cheque Deleted',
                description: `Cheque "${cheque.chequeNo}" has been deleted.`,
            });
            router.refresh();
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error || 'Failed to delete cheque.',
            });
        }
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    };

    return (
      <>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete cheque #{cheque.chequeNo}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <UpdateStatusDialog cheque={row.original} onUpdate={() => router.refresh()} />
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onSelect={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Cheque
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
};


export const columns: ColumnDef<Cheque>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
        const type = row.original.type;
        const color = type === 'Incoming' ? 'text-green-600' : 'text-red-600';
        return <span className={cn('font-medium', color)}>{type}</span>
    }
  },
  {
    accessorKey: 'partyName',
    header: 'Party',
    cell: ({ row }) => {
        return (
            <div className="flex flex-col">
                <span className="font-medium flex items-center gap-1"><User className="h-3 w-3" />{row.original.partyName}</span>
                {row.original.property && <span className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" />{row.original.property}</span>}
                {row.original.contractNo && <span className="text-xs text-muted-foreground flex items-center gap-1"><Library className="h-3 w-3" />{row.original.contractNo}</span>}
            </div>
        )
    }
  },
  {
    accessorKey: 'bankName',
    header: 'Bank Name',
  },
  {
    accessorKey: 'chequeNo',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Cheque No
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
     cell: ({ row }) => {
        return (
            <span className="font-medium">{row.original.chequeNo}</span>
        )
    }
  },
  {
    accessorKey: 'chequeDate',
    header: 'Due Date',
    cell: ({ row }) => {
        const chequeDate = parseISO(row.original.chequeDate);
        const isOverdue = isBefore(chequeDate, startOfToday()) && row.original.status === 'In Hand';
        return <span className={cn(isOverdue && 'text-destructive font-bold')}>{format(chequeDate, 'PP')}</span>;
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: function Cell({ row }) {
      const { formatCurrency } = useCurrency();
      const amount = parseFloat(String(row.getValue('amount')));
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Cheque['status'];
      const config = statusConfig[status];
      return <Badge variant={config.variant} className={cn('gap-1', config.className)}>{config.icon}{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
