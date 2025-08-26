
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ArrowDown, ArrowUp, User, Building, MoreHorizontal, Pencil, LinkIcon } from 'lucide-react';
import { format, isBefore, startOfToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DuePayment } from './schema';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { type Payment } from '@/app/finance/payment/schema';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/currency-context';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const statusConfig: { [key in DuePayment['status']]: { label: string, className: string }} = {
    'Upcoming': { label: 'Upcoming', className: 'bg-gray-500/20 text-gray-700' },
    'Due Soon': { label: 'Due Soon', className: 'bg-yellow-500/20 text-yellow-700' },
    'Overdue': { label: 'Overdue', className: 'bg-red-500/20 text-red-700' },
    'Paid': { label: 'Paid', className: 'bg-green-500/20 text-green-700' },
}

const ActionsCell = ({ row }: { row: { original: DuePayment } }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const duePayment = row.original;

    const defaultValues: Partial<Omit<Payment, 'id'>> = {
        type: duePayment.type === 'Receivable' ? 'Receipt' : 'Payment',
        date: format(new Date(), 'yyyy-MM-dd'),
        partyType: duePayment.partyType,
        partyName: duePayment.partyName,
        amount: duePayment.amount,
        paymentMethod: 'Cash',
        paymentFrom: 'Petty Cash',
        referenceNo: duePayment.id,
        contractNo: duePayment.contractNo,
        property: duePayment.property,
        remarks: `Payment for installment ${duePayment.id}`,
        status: duePayment.type === 'Receivable' ? 'Received' : 'Paid',
    };
    
    const handleShare = () => {
        const paymentUrl = `${window.location.origin}/pay?invoice=${duePayment.id}&amount=${duePayment.amount}&description=${encodeURIComponent(`Payment for ${duePayment.id}`)}`;
        navigator.clipboard.writeText(paymentUrl).then(() => {
            toast({ title: "Link Copied", description: "Payment link copied to clipboard." });
        }, (err) => {
            toast({ variant: 'destructive', title: "Error", description: "Could not copy link."});
        });
    }

    return (
        <>
            <AddPaymentDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onPaymentAdded={() => router.refresh()}
                defaultValues={defaultValues}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setIsDialogOpen(true)} disabled={duePayment.status === 'Paid'}>
                        Record Payment
                    </DropdownMenuItem>
                    {duePayment.type === 'Receivable' && (
                        <DropdownMenuItem onClick={handleShare} disabled={duePayment.status === 'Paid'}>
                            <LinkIcon className="mr-2 h-4 w-4" /> Get Payment Link
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export const columns: ColumnDef<DuePayment>[] = [
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
        const color = type === 'Receivable' ? 'text-green-600' : 'text-red-600';
        const Icon = type === 'Receivable' ? ArrowDown : ArrowUp;
        return <span className={cn('font-medium flex items-center gap-2', color)}><Icon className="h-4 w-4"/>{type}</span>
    }
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Due Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
        const date = new Date(row.getValue('dueDate'));
        const isOverdue = isBefore(date, startOfToday()) && row.original.status !== 'Paid';
        return <span className={cn(isOverdue && 'font-bold text-destructive')}>{format(date, 'PP')}</span>;
    },
  },
  {
    accessorKey: 'partyName',
    header: 'Party',
    cell: ({ row }) => {
        const partyType = row.original.partyType;
        const Icon = partyType === 'Tenant' ? User : Building;
        return (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.partyName}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon className="h-3 w-3" />{partyType}</span>
            </div>
        )
    }
  },
  {
    accessorKey: 'property',
    header: 'Property',
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: function Cell({ row }) {
      const { formatCurrency } = useCurrency();
      const amount = parseFloat(row.getValue('amount'));
      
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as DuePayment['status'];
      const config = statusConfig[status];
      return <Badge variant={'outline'} className={cn(config.className, 'border-transparent')}>{config.label}</Badge>;
    },
  },
   {
    id: 'actions',
    header: 'Action',
    cell: ActionsCell,
  },
];
