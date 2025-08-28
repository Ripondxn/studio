
'use client';

import * as React from 'react';
import { type ReceiptLeaf } from './schema';
import { DataTable } from './book-reports-data-table';
import { columns } from './book-reports-columns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { useCurrency } from '@/context/currency-context';

interface BookReportsClientProps {
    initialReportData: ReceiptLeaf[];
    isLoading: boolean;
}

export function BookReportsClient({ initialReportData, isLoading }: BookReportsClientProps) {
    const [data, setData] = React.useState(initialReportData);
    const [filters, setFilters] = React.useState({ bookNo: '', collector: '', status: '' });
    const { formatCurrency } = useCurrency();

    React.useEffect(() => {
        setData(initialReportData);
    }, [initialReportData]);

    const filteredData = React.useMemo(() => {
        return data.filter(item => {
            const bookNoMatch = filters.bookNo ? item.bookNo.toLowerCase().includes(filters.bookNo.toLowerCase()) : true;
            const collectorMatch = filters.collector ? item.collectedBy?.toLowerCase().includes(filters.collector.toLowerCase()) : true;
            const statusMatch = filters.status ? item.status === filters.status : true;
            return bookNoMatch && collectorMatch && statusMatch;
        });
    }, [data, filters]);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Receipt Book Report", 14, 16);
        (doc as any).autoTable({
            head: [['Receipt No', 'Book No', 'Status', 'Date', 'Party', 'Amount', 'Collector']],
            body: filteredData.map(item => [
                item.receiptNo,
                item.bookNo,
                item.status,
                item.date ? format(new Date(item.date), 'PP') : 'N/A',
                item.partyName ? `${item.partyName} (${item.partyCode})` : 'N/A',
                item.amount ? formatCurrency(item.amount) : 'N/A',
                item.collectedBy || 'N/A'
            ]),
            startY: 20,
        });
        doc.save('receipt-book-report.pdf');
      };

    const handleExportExcel = () => {
        const dataToExport = filteredData.map(item => ({
            'Receipt No': item.receiptNo,
            'Book No': item.bookNo,
            'Status': item.status,
            'Date': item.date ? format(new Date(item.date), 'yyyy-MM-dd') : 'N/A',
            'Party Name': item.partyName || 'N/A',
            'Party Code': item.partyCode || 'N/A',
            'Amount': item.amount || 0,
            'Collected By': item.collectedBy || 'N/A',
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Receipts Report");
        XLSX.writeFile(wb, "receipt-book-report.xlsx");
    };

    const uniqueBookNos = [...new Set(data.map(item => item.bookNo))];
    const uniqueCollectors = [...new Set(data.map(item => item.collectedBy).filter(Boolean))] as string[];

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                     <div>
                        <CardTitle>Receipt Book Report</CardTitle>
                        <CardDescription>A detailed list of every receipt leaf and its status.</CardDescription>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4"/>PDF</Button>
                        <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4"/>Excel</Button>
                     </div>
                </div>
                 <div className="grid grid-cols-3 gap-4 pt-4">
                    <Select value={filters.bookNo} onValueChange={(value) => setFilters(f => ({...f, bookNo: value === 'all' ? '' : value}))}>
                        <SelectTrigger><SelectValue placeholder="Filter by Book No..."/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Books</SelectItem>
                            {uniqueBookNos.map(bookNo => <SelectItem key={bookNo} value={bookNo}>{bookNo}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={filters.collector} onValueChange={(value) => setFilters(f => ({...f, collector: value === 'all' ? '' : value}))}>
                        <SelectTrigger><SelectValue placeholder="Filter by Collector..."/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Collectors</SelectItem>
                             {uniqueCollectors.map(collector => <SelectItem key={collector} value={collector}>{collector}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filters.status} onValueChange={(value) => setFilters(f => ({...f, status: value === 'all' ? '' : value}))}>
                        <SelectTrigger><SelectValue placeholder="Filter by Status..."/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Used">Used</SelectItem>
                            <SelectItem value="Unused">Unused</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={filteredData} isLoading={isLoading} />
            </CardContent>
        </Card>
    );
}
