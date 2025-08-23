
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Printer } from 'lucide-react';
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
import { MoreHorizontal, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PrintablePaymentHistory } from './printable-payment-history';

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
    const printRef = useRef<HTMLDivElement>(null);

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
    
     const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
            const printWindow = window.open('', '', 'height=800,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Print Payment History</title>');
                const tailwindStyles = Array.from(document.styleSheets).find(s => s.href?.includes('tailwind'))?.href;
                if(tailwindStyles) {
                    printWindow.document.write(`<link rel="stylesheet" href="${tailwindStyles}">`);
                }
                printWindow.document.write('<style>body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; } @page { size: A4; margin: 1cm; }</style>');
                printWindow.document.write('</head><body class="bg-white">');
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                setTimeout(() => printWindow.print(), 500);
            }
        }
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
                 <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Payment Receipts</CardTitle>
                        <CardDescription>A history of all payments received from {customerName}.</CardDescription>
                    </div>
                     <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/> Print</Button>
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
             <div className="hidden">
                <PrintablePaymentHistory ref={printRef} payments={payments} customerName={customerName} />
            </div>
        </Card>
    )
}
