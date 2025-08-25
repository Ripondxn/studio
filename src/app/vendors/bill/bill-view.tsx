
'use client';

import { type Bill } from './schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Building2 } from 'lucide-react';
import { useCurrency } from '@/context/currency-context';

export function BillView({ bill }: { bill: Bill }) {
    const { formatCurrency } = useCurrency();
    return (
        <div className="p-8 bg-white text-black max-w-4xl mx-auto my-4 border rounded-sm shadow-sm">
            <header className="flex justify-between items-start pb-6 mb-6 border-b">
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Trust Famous Real Estate</h1>
                        <p className="text-sm text-gray-500">123 Business Rd, Suite 100, City, State 12345</p>
                        <p className="text-sm text-gray-500">contact@yourcompany.com</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-extrabold text-gray-700 uppercase tracking-wider">Bill</h2>
                    <p className="text-sm text-gray-500 mt-1"># {bill.billNo}</p>
                </div>
            </header>
            
            <section className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">From</h3>
                    <p className="font-bold text-gray-800">{bill.vendorName}</p>
                </div>
                <div className="text-right">
                     <div className="mb-2">
                        <p className="text-sm font-semibold text-gray-500">Bill Date:</p>
                        <p className="font-medium text-gray-800">{format(new Date(bill.billDate), 'PP')}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Due Date:</p>
                        <p className="font-medium text-gray-800">{format(new Date(bill.dueDate), 'PP')}</p>
                    </div>
                </div>
            </section>

            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="w-[50%]">Item Description</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bill.items.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <div className="flex justify-end mt-8">
                <div className="w-full max-w-sm space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-800">{formatCurrency(bill.subTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tax ({bill.tax > 0 && bill.subTotal > 0 ? (bill.tax/bill.subTotal * 100).toFixed(0) : 0}%):</span>
                        <span className="font-medium text-gray-800">{formatCurrency(bill.tax)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium text-gray-800">{formatCurrency(bill.total)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-medium text-gray-800">-{formatCurrency(bill.amountPaid || 0)}</span>
                    </div>
                     <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="font-bold text-gray-800 text-base">Balance Due:</span>
                        <span className="font-bold text-gray-800 text-base">{formatCurrency(bill.remainingBalance || 0)}</span>
                    </div>
                </div>
            </div>

            {bill.notes && (
                <section className="mt-12">
                    <h4 className="font-semibold text-gray-600 mb-2">Notes</h4>
                    <p className="text-xs text-gray-500 italic">{bill.notes}</p>
                </section>
            )}

            <footer className="mt-16 pt-4 border-t text-center text-xs text-gray-500">
                <p>Please make payment to the details specified.</p>
            </footer>
        </div>
    )
}
