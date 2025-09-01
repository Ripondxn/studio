
'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileText, FileSpreadsheet, Printer } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/context/currency-context';
import { type UtilityAccount } from './schema';

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

interface DataTableProps<TData extends UtilityAccount, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends UtilityAccount, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const printRef = React.useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    }
  });
  
  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (printContent) {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Utility Accounts</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } h1 { text-align: center; } .no-print { display: none; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>Utility Accounts</h1>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableData = table.getFilteredRowModel().rows.map(row => row.original);

    doc.text("Utility Accounts Report", 14, 16);
    (doc as any).autoTable({
        head: [['Utility Type', 'Provider', 'Account Number', 'Property', 'Unit', 'Total Paid', 'Status']],
        body: tableData.map(acc => [
            acc.utilityType,
            acc.provider,
            acc.accountNumber,
            acc.propertyCode,
            acc.unitCode || 'N/A',
            formatCurrency(acc.totalPaid || 0),
            acc.status,
        ]),
        startY: 20,
    });
    doc.save('utility-accounts.pdf');
  };

  const handleExportExcel = () => {
    const dataToExport = table.getFilteredRowModel().rows.map(row => {
        const acc = row.original as any;
        return {
            'Utility Type': acc.utilityType,
            'Provider': acc.provider,
            'Account Number': acc.accountNumber,
            'Property': acc.propertyCode,
            'Unit': acc.unitCode || 'N/A',
            'Total Paid': acc.totalPaid || 0,
            'Status': acc.status,
        }
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Utility Accounts");
    XLSX.writeFile(wb, "utility-accounts.xlsx");
  };

  return (
    <div>
        <div className="flex justify-end mb-4 no-print gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
        </div>
        <div ref={printRef}>
            <div className="rounded-md border">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        );
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                            )}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                        No utility accounts found.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </div>
      </div>
        <div className="flex items-center justify-end space-x-2 py-4 no-print">
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Next
            </Button>
        </div>
    </div>
  );
}
