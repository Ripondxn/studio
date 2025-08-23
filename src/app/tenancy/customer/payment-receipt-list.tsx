
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { getPaymentsForCustomer } from './actions';
import { deletePayment } from '@/app/finance/payment/actions';
import { type Payment } from '@/app/finance/payment/schema';
import { useToast } from '@/hooks/use-toast';
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

interface PaymentReceiptListProps {
    customerCode: string;
    customerName: string;
    onRefresh: () => void;
}

export function PaymentReceiptList({ customerCode, customerName, onRefresh }: PaymentReceiptListProps) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchPayments = useCallback(async () => {
        if (!customerCode) return;
        setIsLoading(true);
        const data = await getPaymentsForCustomer(customerCode);
        setPayments(data);
        setIsLoading(false);
    }, [customerCode]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleDelete = async () => {
        if (!selectedPaymentId) return;
        setIsDeleting(true);
        const result = await deletePayment(selectedPaymentId);
        if (result.success) {
            toast({ title: 'Payment Deleted' });
            fetchPayments();
            onRefresh(); // To refresh parent components like invoice list
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsDeleting(false);
        setSelectedPaymentId(null);
    }
    
    return (
        <Card>
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
            <CardHeader>
                <CardTitle>Payment Receipts</CardTitle>
                <CardDescription>A history of all payments received from {customerName}.</CardDescription>
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
                                <TableHead>Reference</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">No payment receipts found.</TableCell>
                                </TableRow>
                            ) : (
                                payments.map(payment => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{format(new Date(payment.date), 'PP')}</TableCell>
                                        <TableCell>{payment.referenceNo}</TableCell>
                                        <TableCell><Badge variant="outline">{payment.paymentMethod}</Badge></TableCell>
                                        <TableCell className="text-right font-medium text-green-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setSelectedPaymentId(payment.id!)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
