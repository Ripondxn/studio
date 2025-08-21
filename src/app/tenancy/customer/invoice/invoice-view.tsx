
'use client';

import { type Invoice } from './schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export function InvoiceView({ invoice }: { invoice: Invoice }) {
    return (
        <div className="p-8 bg-white text-black">
            <header className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold text-primary">INVOICE</h1>
                    <p className="text-muted-foreground">Invoice #: {invoice.invoiceNo}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-semibold">Your Company Name</h2>
                    <p className="text-sm">123 Business Rd, Suite 100</p>
                    <p className="text-sm">City, State, 12345</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 my-8">
                <div>
                    <h3 className="font-semibold mb-2">Bill To:</h3>
                    <p>{invoice.customerName}</p>
                    <p>{/* Add customer address if available */}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-semibold">Invoice Date:</span> {format(new Date(invoice.invoiceDate), 'PP')}</p>
                    <p><span className="font-semibold">Due Date:</span> {format(new Date(invoice.dueDate), 'PP')}</p>
                </div>
            </section>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoice.items.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.unitPrice)}</TableCell>
                            <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.quantity * item.unitPrice)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3} className="text-right">Subtotal</TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.subTotal)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} className="text-right">Tax</TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.tax)}</TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                        <TableCell colSpan={3} className="text-right">Total</TableCell>
                        <TableCell className="text-right text-lg">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.total)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            {invoice.notes && (
                <section className="mt-8">
                    <h4 className="font-semibold mb-2">Notes:</h4>
                    <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                </section>
            )}
            <footer className="mt-12 pt-4 border-t text-center text-xs text-muted-foreground">
                <p>Thank you for your business!</p>
            </footer>
        </div>
    )
}
