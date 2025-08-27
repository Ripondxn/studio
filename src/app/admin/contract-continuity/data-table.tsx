
'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { format, parseISO } from 'date-fns';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

// Extend jsPDF type to include autoTable from the plugin
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  reportTitle: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  reportTitle
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const visibleColumns = columns.filter(c => c.id !== 'actions' && ('accessorKey' in c));
    
    const head = [visibleColumns.map(col => {
      if (typeof col.header === 'string') return col.header;
      // Simple fallback for functional headers
      return (col as any).accessorKey?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || col.id || '';
    })];
    
    const body = data.map(row =>
      visibleColumns.map(col => {
        // @ts-ignore
        let value = row[(col as any).accessorKey as keyof TData] as any;
        if ((col as any).accessorKey === 'startDate' || (col as any).accessorKey === 'endDate' || (col as any).accessorKey === 'date') {
          value = value ? format(parseISO(value), 'PP') : '';
        }
        return String(value ?? '');
      })
    );
    
    doc.text(reportTitle, 14, 16);
    (doc as any).autoTable({
        head: head,
        body: body,
        startY: 22,
    });
    doc.save(`${reportTitle.toLowerCase().replace(/\s/g, '-')}.pdf`);
  };

  const handleExportExcel = () => {
    const visibleColumns = columns.filter(c => c.id !== 'actions' && ('accessorKey' in c));
    const dataToExport = data.map(row => {
        let obj: any = {};
        visibleColumns.forEach(col => {
            const header = typeof col.header === 'string' ? col.header : ((col as any).accessorKey?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || col.id);
            // @ts-ignore
            let value = row[(col as any).accessorKey as keyof TData] as any;
             if ((col as any).accessorKey === 'startDate' || (col as any).accessorKey === 'endDate' || (col as any).accessorKey === 'date') {
                value = value ? format(parseISO(value), 'PP') : '';
            }
            obj[header] = value;
        });
        return obj;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportTitle);
    XLSX.writeFile(wb, `${reportTitle.toLowerCase().replace(/\s/g, '-')}.xlsx`);
  };
  
   const handlePrint = () => {
    window.print();
  }

  return (
    <>
        <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
      <div id="printable-area">
        <div className="flex items-center py-4 gap-2 no-print">
            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <FileText className="mr-2 h-4 w-4" /> Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                </Button>
            </div>
        </div>
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
                    No problematic contracts found.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
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
    </>
  );
}

