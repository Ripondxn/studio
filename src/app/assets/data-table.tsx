
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
import { type Asset } from './schema';

// Extend jsPDF type to include autoTable from the plugin
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

interface DataTableProps<TData extends Asset, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Asset, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const { formatCurrency } = useCurrency();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableData = table.getFilteredRowModel().rows.map(row => row.original);

    doc.text("Asset Register Report", 14, 16);
    (doc as any).autoTable({
        head: [['Code', 'Name', 'Type', 'Purchase Date', 'Cost', 'Current Value']],
        body: tableData.map(asset => [
            asset.assetCode,
            asset.assetName,
            asset.assetType,
            asset.purchaseDate,
            formatCurrency(asset.purchaseCost),
            formatCurrency(asset.currentValue || 0)
        ]),
        startY: 20,
    });
    doc.save('asset-report.pdf');
  };

  const handleExportExcel = () => {
    const dataToExport = table.getFilteredRowModel().rows.map(row => {
        const asset = row.original;
        return {
            'Asset Code': asset.assetCode,
            'Asset Name': asset.assetName,
            'Type': asset.assetType,
            'Purchase Date': asset.purchaseDate,
            'Purchase Cost': asset.purchaseCost,
            'Current Value': asset.currentValue || 0,
        }
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, "asset-report.xlsx");
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
      <div className="rounded-md border p-4">
        <div className="flex items-center py-4 gap-4 no-print">
          <Input
            placeholder="Filter by asset name..."
            value={(table.getColumn('assetName')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('assetName')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Input
            placeholder="Filter by asset code..."
            value={(table.getColumn('assetCode')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('assetCode')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" /> Print Report
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
                    No assets found.
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
