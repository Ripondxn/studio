
'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Banknote, Trash2, CheckCircle, XCircle, Hourglass, Calendar, Library, Landmark, Building2, User } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateChequeStatus } from './actions';
import { Cheque } from './schema';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

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
};


const UpdateStatusDialog = ({ cheque, onUpdate }: { cheque: Cheque, onUpdate: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<Cheque['status']>(cheque.status);
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const { toast } = useToast();

    const handleUpdate = async () => {
        const result = await updateChequeStatus(cheque.id, status, date);
        if (result.success) {
            toast({ title: 'Status Updated', description: `Cheque ${cheque.chequeNo} status updated to ${status}.` });
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
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as Cheque['status'])} className="w-full p-2 border rounded-md">
                            {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    {relevantDateLabel && (
                         <div className="space-y-2">
                            <Label htmlFor="date">{relevantDateLabel}</Label>
                            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
    return (
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
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Cheque
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
            <div className="flex flex-col">
                <span className="font-medium">{row.original.chequeNo}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Landmark className="h-3 w-3" />{row.original.bankName}</span>
            </div>
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
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
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
