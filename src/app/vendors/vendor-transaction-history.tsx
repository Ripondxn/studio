
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Minus, MoreHorizontal, Edit, Trash2, Printer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { getPaymentsForVendor } from './actions';
import { type Payment } from '@/app/finance/payment/schema';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { deletePayment } from '@/app/finance/payment/actions';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


interface VendorTransactionHistoryProps {
    vendorCode: string;
    vendorName: string;
}

export function VendorTransactionHistory({ vendorCode, vendorName }: VendorTransactionHistoryProps) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [paymentDefaultValues, setPaymentDefaultValues] = useState<Partial<Omit<Payment, 'id'>>>({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const fetchPaymentData = useCallback(async () => {
        if (!vendorCode) return;
        setIsLoading(true);
        const paymentsData = await getPaymentsForVendor(vendorCode);
        setPayments(paymentsData);
        setIsLoading(false);
    }, [vendorCode]);

    useEffect(() => {
        fetchPaymentData();
    }, [fetchPaymentData]);
    
    const handleRecordPayment = () => {
        setPaymentDefaultValues({
            type: 'Payment',
            partyType: 'Vendor',
            partyName: vendorCode,
            status: 'Paid',
        });
        setIsPaymentDialogOpen(true);
    }
    
     const handleRecordRefund = () => {
        setPaymentDefaultValues({
            type: 'Receipt',
            partyType: 'Vendor',
            partyName: vendorCode,
            status: 'Received',
            remarks: 'Vendor Refund',
        });
        setIsPaymentDialogOpen(true);
    }

    const handleSuccess = () => {
        fetchPaymentData();
        router.refresh();
    };
    
    const financialSummary = useMemo(() => {
        return payments.reduce((acc, p) => {
            if (p.type === 'Payment') {
                acc.totalPaid += p.amount;
            } else if (p.type === 'Receipt') {
                acc.totalRefunds += p.amount;
            }
            return acc;
        }, { totalPaid: 0, totalRefunds: 0 });
    }, [payments]);

    const handleDelete = async () => {
        if (!selectedPaymentId) return;
        setIsDeleting(true);
        const result = await deletePayment(selectedPaymentId);
        if (result.success) {
            toast({ title: 'Payment Deleted' });
            fetchPaymentData();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsDeleting(false);
        setSelectedPaymentId(null);
    };

    const handlePrint = () => {
        const doc = new jsPDF();
        doc.text(`Transaction History for ${vendorName}`, 14, 16);
        (doc as any).autoTable({
            head: [['Date', 'Type', 'Reference', 'Method', 'Amount']],
            body: payments.map(p => [
                format(new Date(p.date), 'PP'),
                p.type === 'Receipt' ? 'Refund' : 'Payment',
                p.referenceNo || 'N/A',
                p.paymentMethod,
                `${p.type === 'Receipt' ? '+' : '-'}${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.amount)}`
            ]),
            startY: 22,
        });
        doc.save(`vendor-history-${vendorCode}.pdf`);
    };

    return (
        <>
            <AlertDialog open={!!selectedPaymentId} onOpenChange={(open) => !open && setSelectedPaymentId(null)}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently delete the payment and reverse its financial impact. This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AddPaymentDialog
                isOpen={isPaymentDialogOpen}
                setIsOpen={setIsPaymentDialogOpen}
                defaultValues={paymentDefaultValues}
                onPaymentAdded={handleSuccess}
            />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Billing & Refund History</CardTitle>
                            <CardDescription>A record of payments made to and refunds received from {vendorName}.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                            <Button variant="outline" onClick={handleRecordRefund}>
                                <Plus className="mr-2 h-4 w-4" /> Record Refund
                            </Button>
                             <Button onClick={handleRecordPayment}>
                                <Minus className="mr-2 h-4 w-4" /> Record Payment
                            </Button>
                        </div>
                    </div>
                     <div className="grid grid-cols-3 gap-4 text-center mt-4 border rounded-lg p-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Paid</p>
                            <p className="text-xl font-bold text-red-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialSummary.totalPaid)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Refunds</p>
                            <p className="text-xl font-bold text-green-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialSummary.totalRefunds)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Net Paid</p>
                            <p className="text-xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialSummary.totalPaid - financialSummary.totalRefunds)}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">No transactions found.</TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map(payment => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{format(new Date(payment.date), 'PP')}</TableCell>
                                            <TableCell>
                                                <Badge variant={payment.type === 'Receipt' ? 'secondary' : 'outline'} className={cn(payment.type === 'Receipt' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'border-transparent')}>
                                                    {payment.type === 'Receipt' ? 'Refund' : 'Payment'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{payment.referenceNo}</TableCell>
                                            <TableCell><Badge variant="outline">{payment.paymentMethod}</Badge></TableCell>
                                            <TableCell className={cn("text-right font-medium", payment.type === 'Receipt' ? 'text-green-600' : 'text-red-600')}>
                                                {payment.type === 'Receipt' ? '+' : '-'}
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onSelect={() => toast({title: "Coming Soon", description: "Edit functionality will be available in a future update."})}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive" onSelect={() => setSelectedPaymentId(payment.id!)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
