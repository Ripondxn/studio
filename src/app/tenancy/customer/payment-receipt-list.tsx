'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Printer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { getPaymentsForCustomer } from './actions';
import { getInvoicesForCustomer } from './invoice/actions';
import { deletePayment } from '@/app/finance/payment/actions';
import { type Payment } from '@/app/finance/payment/schema';
import { type Invoice } from './invoice/schema';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MoreHorizontal, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PrintablePaymentHistory } from './printable-payment-history';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PaymentReceiptListProps {
    customerCode: string;
    customerName: string;
    onRefresh: () => void;
}

export function PaymentReceiptList({ customerCode, customerName, onRefresh }: PaymentReceiptListProps) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
    const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
    const [invoicesForPrinting, setInvoicesForPrinting] = useState<Invoice[]>([]);
    const { toast } = useToast();
    const printRef = useRef<HTMLDivElement>(null);

    const fetchPaymentData = useCallback(async () => {
        if (!customerCode) return;
        setIsLoading(true);
        const [paymentsData, invoicesData] = await Promise.all([
            getPaymentsForCustomer(customerCode),
            getInvoicesForCustomer(customerCode),
        ]);
        setPayments(paymentsData);
        setInvoices(invoicesData.map(i => ({...i, remainingBalance: i.total - (i.amountPaid || 0)})));
        setSelectedInvoiceIds(invoicesData.map(i => i.id));
        setIsLoading(false);
    }, [customerCode]);

    useEffect(() => {
        fetchPaymentData();
    }, [fetchPaymentData]);

    const handleDelete = async () => {
        if (!selectedPaymentId) return;
        setIsDeleting(true);
        const result = await deletePayment(selectedPaymentId);
        if (result.success) {
            toast({ title: 'Payment Deleted' });
            fetchPaymentData();
            onRefresh(); // To refresh parent components like invoice list
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsDeleting(false);
        setSelectedPaymentId(null);
    }
    
    const handlePrintSelection = () => {
        const selected = invoices.filter(inv => selectedInvoiceIds.includes(inv.id));
        setInvoicesForPrinting(selected);
        
        // Use a timeout to allow state to update before printing
        setTimeout(() => {
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
        }, 100);
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
            <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Select Invoices to Print</DialogTitle>
                        <DialogDescription>Choose which invoices to include in the statement of account.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-72 border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                     <Checkbox
                                        checked={selectedInvoiceIds.length === invoices.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedInvoiceIds(invoices.map(i => i.id));
                                            } else {
                                                setSelectedInvoiceIds([]);
                                            }
                                        }}
                                     />
                                </TableHead>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedInvoiceIds.includes(invoice.id)}
                                            onCheckedChange={(checked) => {
                                                setSelectedInvoiceIds(prev => 
                                                    checked ? [...prev, invoice.id] : prev.filter(id => id !== invoice.id)
                                                );
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{invoice.invoiceNo}</TableCell>
                                    <TableCell>{format(new Date(invoice.invoiceDate), 'PP')}</TableCell>
                                    <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </ScrollArea>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handlePrintSelection}>
                           <Printer className="mr-2 h-4 w-4"/> Print Selected ({selectedInvoiceIds.length})
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <CardHeader>
                 <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Payment Receipts</CardTitle>
                        <CardDescription>A history of all payments received from {customerName}.</CardDescription>
                    </div>
                     <Button variant="outline" onClick={() => setIsPrintDialogOpen(true)}><Printer className="mr-2 h-4 w-4"/> Print Statement</Button>
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
                <PrintablePaymentHistory 
                    ref={printRef} 
                    payments={payments} 
                    invoices={invoicesForPrinting}
                    customerName={customerName} 
                />
            </div>
        </Card>
    )
}
