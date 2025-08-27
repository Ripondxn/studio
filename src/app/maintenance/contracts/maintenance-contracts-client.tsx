
'use client';

import { useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Plus, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { type MaintenanceContract } from './schema';
import { type Payment } from '@/app/finance/payment/schema';
import { useCurrency } from '@/context/currency-context';

export function MaintenanceContractsClient({ initialContracts }: { initialContracts: MaintenanceContract[] }) {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentDefaultValues, setPaymentDefaultValues] = useState<Partial<Omit<Payment, 'id'>> | undefined>();
  const { formatCurrency } = useCurrency();

  const handleRecordPayment = (contract: MaintenanceContract) => {
    setPaymentDefaultValues({
      type: 'Payment',
      partyType: 'Vendor',
      partyName: contract.vendorCode,
      amount: contract.totalValue,
      referenceNo: contract.contractNo,
      status: 'Paid',
      remarks: `Payment for ${contract.serviceType} contract #${contract.contractNo}`,
      maintenanceTicketId: undefined, // Or link to a specific ticket if applicable
      property: contract.propertyCode,
    });
    setIsPaymentDialogOpen(true);
  };
  
  const handlePaymentAdded = () => {
    // In a real app with a database, you would re-fetch data here.
    // For now, we can just close the dialog.
    setIsPaymentDialogOpen(false);
  };
  
  const handleExportPDF = (data: MaintenanceContract[]) => {
    const doc = new jsPDF();
    doc.text("Maintenance Contracts Report", 14, 16);
    (doc as any).autoTable({
        head: [['Contract No', 'Service', 'Vendor', 'Property', 'Start Date', 'End Date', 'Value']],
        body: data.map(c => [
            c.contractNo,
            c.serviceType,
            c.vendorCode,
            c.propertyCode,
            format(new Date(c.startDate), 'PP'),
            format(new Date(c.endDate), 'PP'),
            formatCurrency(c.totalValue)
        ]),
        startY: 20,
    });
    doc.save('maintenance-contracts.pdf');
  };

  const handleExportExcel = (data: MaintenanceContract[]) => {
    const dataToExport = data.map(c => ({
        'Contract No': c.contractNo,
        'Service Type': c.serviceType,
        'Vendor Code': c.vendorCode,
        'Property Code': c.propertyCode,
        'Start Date': format(new Date(c.startDate), 'yyyy-MM-dd'),
        'End Date': format(new Date(c.endDate), 'yyyy-MM-dd'),
        'Total Value': c.totalValue,
        'Status': c.status,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MaintenanceContracts");
    XLSX.writeFile(wb, "maintenance-contracts.xlsx");
  };

  return (
     <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Maintenance Contracts</h1>
                <p className="text-muted-foreground">Manage recurring service contracts with vendors.</p>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportPDF(initialContracts)}>
                    <FileText className="mr-2 h-4 w-4" /> Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportExcel(initialContracts)}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                </Button>
                 <Button asChild>
                    <Link href="/maintenance/contracts/add">
                        <Plus className="mr-2 h-4 w-4" /> Add New Contract
                    </Link>
                </Button>
            </div>
        </div>
        <DataTable columns={columns(handleRecordPayment)} data={initialContracts} />
        {isPaymentDialogOpen && (
             <AddPaymentDialog
                isOpen={isPaymentDialogOpen}
                setIsOpen={setIsPaymentDialogOpen}
                defaultValues={paymentDefaultValues}
                onPaymentAdded={handlePaymentAdded}
            />
        )}
    </div>
  );
}
