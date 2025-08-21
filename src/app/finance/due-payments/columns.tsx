
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ArrowDown, ArrowUp, User, Building, MoreHorizontal, Pencil } from 'lucide-react';
import { format, isBefore, startOfToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DuePayment } from './schema';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, type Payment } from '@/app/finance/payment/schema';
import { addPayment } from '@/app/finance/payment/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusConfig: { [key in DuePayment['status']]: { label: string, className: string }} = {
    'Upcoming': { label: 'Upcoming', className: 'bg-gray-500/20 text-gray-700' },
    'Due Soon': { label: 'Due Soon', className: 'bg-yellow-500/20 text-yellow-700' },
    'Overdue': { label: 'Overdue', className: 'bg-red-500/20 text-red-700' },
    'Paid': { label: 'Paid', className: 'bg-green-500/20 text-green-700' },
}

const paymentFormSchema = paymentSchema.omit({ id: true });

function RecordPaymentDialog({ duePayment, onPaymentRecorded }: { duePayment: DuePayment; onPaymentRecorded: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<Omit<Payment, 'id'>>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            type: duePayment.type === 'Receivable' ? 'Receipt' : 'Payment',
            date: format(new Date(), 'yyyy-MM-dd'),
            partyType: duePayment.partyType,
            partyName: duePayment.partyName,
            amount: duePayment.amount,
            paymentMethod: 'Cash',
            referenceNo: duePayment.id,
            contractNo: duePayment.contractNo,
            property: duePayment.property,
            remarks: `Payment for installment ${duePayment.id}`,
            status: duePayment.type === 'Receivable' ? 'Received' : 'Paid',
        },
    });

    const onSubmit = async (data: Omit<Payment, 'id'>) => {
        setIsSaving(true);
        const result = await addPayment(data);
        if (result.success) {
            toast({
                title: 'Payment Recorded',
                description: 'The payment has been successfully recorded.',
            });
            onPaymentRecorded();
            setIsOpen(false);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error || 'Failed to record payment.',
            });
        }
        setIsSaving(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={duePayment.status === 'Paid'}>
                    Record Payment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Record Payment for {duePayment.partyName}</DialogTitle>
                        <DialogDescription>
                            Confirm payment details for installment {duePayment.id}. Amount: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(duePayment.amount)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Payment Date</Label>
                            <Input id="date" type="date" {...register('date')} />
                            {errors.date && <p className="text-destructive text-xs mt-1">{errors.date.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method</Label>
                            <Controller
                                name="paymentMethod"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="Card">Card</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="remarks">Remarks</Label>
                            <Textarea id="remarks" {...register('remarks')} />
                        </div>
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Payment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


const ActionsCell = ({ row }: { row: { original: DuePayment } }) => {
    const router = useRouter();
    return (
        <RecordPaymentDialog
            duePayment={row.original}
            onPaymentRecorded={() => router.refresh()}
        />
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
