
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { getPaymentsForVendor } from './actions';
import { type Payment } from '@/app/finance/payment/schema';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface VendorTransactionHistoryProps {
    vendorName: string;
    onRefresh: () => void;
}

export function VendorTransactionHistory({ vendorName, onRefresh }: VendorTransactionHistoryProps) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [paymentDefaultValues, setPaymentDefaultValues] = useState<Partial<Omit<Payment, 'id'>>>({});
    const router = useRouter();

    const fetchPaymentData = useCallback(async () => {
        if (!vendorName) return;
        setIsLoading(true);
        const paymentsData = await getPaymentsForVendor(vendorName);
        setPayments(paymentsData);
        setIsLoading(false);
    }, [vendorName]);

    useEffect(() => {
        fetchPaymentData();
    }, [fetchPaymentData]);
    
    const handleRecordPayment = () => {
        setPaymentDefaultValues({
            type: 'Payment',
            partyType: 'Vendor',
            partyName: vendorName,
            status: 'Paid',
        });
        setIsPaymentDialogOpen(true);
    }
    
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

    return (
        <>
            <AddPaymentDialog
                isOpen={isPaymentDialogOpen}
                setIsOpen={setIsPaymentDialogOpen}
                defaultValues={paymentDefaultValues}
                onPaymentAdded={() => {
                    fetchPaymentData();
                    onRefresh();
                }}
            />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Billing & Refund History</CardTitle>
                            <CardDescription>A record of payments made to {vendorName}.</CardDescription>
                        </div>
                        <Button onClick={handleRecordPayment}>
                            <Plus className="mr-2 h-4 w-4" /> Record Payment
                        </Button>
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">No transactions found.</TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map(payment => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{format(new Date(payment.date), 'PP')}</TableCell>
                                            <TableCell>
                                                <Badge variant={payment.type === 'Receipt' ? 'secondary' : 'outline'} className={cn(payment.type === 'Receipt' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'border-transparent')}>
                                                    {payment.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{payment.referenceNo}</TableCell>
                                            <TableCell><Badge variant="outline">{payment.paymentMethod}</Badge></TableCell>
                                            <TableCell className="text-right font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)}</TableCell>
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
