
'use client';

import { useState, useEffect } from 'react';
import { getCheques, getSummary } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddChequeDialog } from './add-cheque-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Clock, CheckCircle, Hourglass, FileText, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { type Cheque } from './schema';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

// Extend jsPDF type to include autoTable from the plugin
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}


type Summary = {
    inHandCount: number;
    inHandTotal: number;
    dueThisWeekCount: number;
    dueThisWeekTotal: number;
    depositedCount: number;
    depositedTotal: number;
    clearedThisMonthCount: number;
    clearedThisMonthTotal: number;
    overdueCount: number;
    overdueTotal: number;
}

export function ChequesClient({ initialCheques, initialSummary }: { initialCheques: Cheque[], initialSummary: Summary }) {
  const [cheques, setCheques] = useState(initialCheques);
  const [summary, setSummary] = useState(initialSummary);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const refreshData = async () => {
    setIsLoading(true);
    const [chequesResult, summaryResult] = await Promise.all([
        getCheques(),
        getSummary()
    ]);
    setCheques(chequesResult);
    setSummary(summaryResult);
    setIsLoading(false);
  }

  useEffect(() => {
    setCheques(initialCheques);
    setSummary(initialSummary);
  }, [initialCheques, initialSummary]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const exportableColumns = columns.filter(col => 'accessorKey' in col && col.accessorKey && col.id !== 'actions');
    
    const head = [exportableColumns.map(col => {
        if (typeof col.header === 'string') return col.header;
        // @ts-ignore
        const key = col.accessorKey as string || col.id || '';
        return key.charAt(0).toUpperCase() + key.slice(1);
    })];

    const body = cheques.map(cheque => 
        exportableColumns.map(col => {
            // @ts-ignore
            const value = cheque[col.accessorKey as keyof Cheque];
            if (col.accessorKey === 'amount') {
                 return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(value as number);
            }
            if (col.accessorKey === 'chequeDate' && value) {
                return format(new Date(value as string), 'PP');
            }
            return String(value ?? '');
        })
    );

    doc.text("Cheques List", 14, 16);
    doc.autoTable({
        head: head,
        body: body,
        startY: 20,
    });
    doc.save('cheques.pdf');
  };

  const handleExportExcel = () => {
    const dataToExport = cheques.map(cheque => {
        let obj: any = {};
         columns.filter(col => 'accessorKey' in col && col.accessorKey && col.id !== 'actions').forEach(col => {
            // @ts-ignore
            const headerText = (typeof col.header === 'string' ? col.header : col.accessorKey) as string;
            // @ts-ignore
            obj[headerText] = cheque[col.accessorKey as keyof Cheque];
         })
         return obj;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cheques");
    XLSX.writeFile(wb, "cheques.xlsx");
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Cheque Management</h1>
            <p className="text-muted-foreground">
                Track and manage all post-dated cheques from tenants and to landlords.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
            </Button>
            <AddChequeDialog onChequeAdded={refreshData} />
            <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Hand Cheques</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.inHandTotal)}</div>
            <p className="text-xs text-muted-foreground">{summary.inHandCount} cheques pending deposit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.dueThisWeekTotal)}</div>
            <p className="text-xs text-muted-foreground">{summary.dueThisWeekCount} cheques to be deposited</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 text-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Cheques</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.overdueTotal)}</div>
                <p className="text-xs text-destructive/80">{summary.overdueCount} cheques require immediate attention</p>
            </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deposited Cheques</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.depositedTotal)}</div>
            <p className="text-xs text-muted-foreground">{summary.depositedCount} cheques awaiting clearance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cleared Cheques (Month)</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.clearedThisMonthTotal)}</div>
            <p className="text-xs text-muted-foreground">{summary.clearedThisMonthCount} cheques cleared</p>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={cheques} />
    </div>
  );
}
