
'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

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
import { FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { useCurrency } from '@/context/currency-context';
import { StockItem } from './schema';

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

interface DataTableProps<TData extends StockItem, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  storeName: string;
}

export function DataTable<TData extends StockItem, TValue>({
  columns,
  data,
  storeName,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });
  const { formatCurrency } = useCurrency();
  const printRef = React.useRef<HTMLDivElement>(null);


  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Stock Report for ${storeName}`, 14, 16);
    (doc as any).autoTable({
        head: [['Item Code', 'Item Name', 'Quantity']],
        body: table.getFilteredRowModel().rows.map(row => [
            row.original.itemCode,
            row.original.itemName,
            row.original.quantity,
        ]),
        startY: 20,
    });
    doc.save(`stock-report-${storeName}.pdf`);
  };

  const handleExportExcel = () => {
    const dataToExport = table.getFilteredRowModel().rows.map(row => ({
        'Item Code': row.original.itemCode,
        'Item Name': row.original.itemName,
        'Quantity': row.original.quantity,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");
    XLSX.writeFile(wb, `stock-report-${storeName}.xlsx`);
  };

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (printContent) {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Stock Report</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } h1 { text-align: center; } .no-print { display: none; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(`<h1>Stock Report for ${storeName}</h1>`);
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }
  };

  return (
    <div>
        <div className="flex items-center py-4 gap-2">
            <Input
            placeholder="Filter by item name..."
            value={(table.getColumn('itemName')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
                table.getColumn('itemName')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
            </div>
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
                        className="h-24 text-center text-muted-foreground"
                    >
                        No stock in this location.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </div>
      </div>
    </div>
  );
}
