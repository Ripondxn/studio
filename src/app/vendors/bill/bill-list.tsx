
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, DollarSign } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { BillDialog } from './bill-dialog';
import { type Bill } from './schema';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { type Payment } from '@/app/finance/payment/schema';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface BillListProps {
    vendorCode: string;
    vendorName: string;
    bills: Bill[];
    isLoading: boolean;
    onRefresh: () => void;
}

export function BillList({ vendorCode, vendorName, bills, isLoading, onRefresh }: BillListProps) {
    const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [paymentDefaultValues, setPaymentDefaultValues] = useState<Partial<Omit<Payment, 'id'>>>();
    const router = useRouter();
    
    const handleCreateClick = () => {
        setSelectedBill(null);
        setIsViewMode(false);
        setIsBillDialogOpen(true);
    }
    
    const handleEditClick = (bill: Bill) => {
        setSelectedBill(bill);
        setIsViewMode(false);
        setIsBillDialogOpen(true);
    }
    
    const handleViewClick = (bill: Bill) => {
        setSelectedBill(bill);
        setIsViewMode(true);
        setIsBillDialogOpen(true);
    }
    
    const handleRecordPayment = (bill?: Bill) => {
        const openBills = bill ? [bill] : bills.filter(b => b.status !== 'Paid' && b.status !== 'Cancelled');
        
        setPaymentDefaultValues({
            type: 'Payment',
            partyType: 'Vendor',
            partyName: vendorName,
            date: format(new Date(), 'yyyy-MM-dd'),
            status: 'Paid',
            amount: bill ? (bill.remainingBalance || 0) : 0,
            billAllocations: openBills.map(i => ({
                billId: i.id,
                amount: i.id === bill?.id ? (i.remainingBalance || 0) : 0,
            }))
        });
        setIsPaymentDialogOpen(true);
    }

    const handleSuccess = () => {
        onRefresh();
    }
    
    const financialSummary = useMemo(() => {
        return bills.reduce((acc, bill) => {
            if (bill.status !== 'Cancelled') {
                acc.totalBilled += bill.total;
                acc.totalPaid += bill.amountPaid || 0;
            }
            return acc;
        }, { totalBilled: 0, totalPaid: 0 });
    }, [bills]);


    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Bills</CardTitle>
                        <CardDescription>Manage bills from {vendorName}.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button onClick={() => handleRecordPayment()}>
                            <DollarSign className="mr-2 h-4 w-4" /> Pay Bill
                        </Button>
                        <Button variant="outline" onClick={handleCreateClick}>
                            <Plus className="mr-2 h-4 w-4" /> Create Bill
                        </Button>
                    </div>
                </div>
                 <div className="grid grid-cols-3 gap-4 text-center mt-4 border rounded-lg p-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Billed</p>
                        <p className="text-xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialSummary.totalBilled)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Paid</p>
                        <p className="text-xl font-bold text-green-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialSummary.totalPaid)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Balance Due</p>
                        <p className="text-xl font-bold text-red-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(financialSummary.totalBilled - financialSummary.totalPaid)}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <DataTable columns={columns({ onEdit: handleEditClick, onView: handleViewClick, onRecordPayment: handleRecordPayment })} data={bills} />
                )}
                
                <BillDialog
                    isOpen={isBillDialogOpen}
                    setIsOpen={setIsBillDialogOpen}
                    bill={selectedBill}
                    vendor={{ code: vendorCode, name: vendorName }}
                    onSuccess={handleSuccess}
                    isViewMode={isViewMode}
                />
                 {/* This payment dialog can now handle bill allocations */}
                 <AddPaymentDialog
                    isOpen={isPaymentDialogOpen}
                    setIsOpen={setIsPaymentDialogOpen}
                    defaultValues={paymentDefaultValues}
                    vendorBills={bills.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled' && (i.remainingBalance || 0) > 0)}
                    onPaymentAdded={handleSuccess}
                />
            </CardContent>
        </Card>
    )
}
