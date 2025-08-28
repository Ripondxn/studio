
'use client';

import * as React from 'react';
import { type ChequeLeaf } from './schema';
import { DataTable } from './cheque-book-reports-data-table';
import { columns } from './cheque-book-reports-columns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { useCurrency } from '@/context/currency-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChequeBookReportsClientProps {
    initialReportData: ChequeLeaf[];
    isLoading: boolean;
}

export function ChequeBookReportsClient({ initialReportData, isLoading }: ChequeBookReportsClientProps) {
    const [data, setData] = React.useState(initialReportData);
    const [filters, setFilters] = React.useState({ bankName: '', bookNo: '', status: '' });
    const { formatCurrency } = useCurrency();

    React.useEffect(() => {
        setData(initialReportData);
    }, [initialReportData]);

    const filteredData = React.useMemo(() => {
        return data.filter(item => {
            const bankMatch = filters.bankName ? item.bankName.toLowerCase().includes(filters.bankName.toLowerCase()) : true;
            const bookNoMatch = filters.bookNo ? item.bookNo.toLowerCase().includes(filters.bookNo.toLowerCase()) : true;
            const statusMatch = filters.status ? item.status === filters.status : true;
            return bankMatch && bookNoMatch && statusMatch;
        });
    }, [data, filters]);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Cheque Book Report", 14, 16);
        (doc as any).autoTable({
            head: [['Cheque No', 'Book No', 'Bank', 'Status', 'Date Used', 'Party', 'Amount']],
            body: filteredData.map(item => [
                item.chequeNo,
                item.bookNo,
                item.bankName,
                item.status,
                item.date ? format(new Date(item.date), 'PP') : 'N/A',
                item.partyName || 'N/A',
                item.amount ? formatCurrency(item.amount) : 'N/A'
            ]),
            startY: 20,
        });
        doc.save('cheque-book-report.pdf');
      };

    const handleExportExcel = () => {
        const dataToExport = filteredData.map(item => ({
            'Cheque No': item.chequeNo,
            'Book No': item.bookNo,
            'Bank Name': item.bankName,
            'Status': item.status,
            'Date Used': item.date ? format(new Date(item.date), 'yyyy-MM-dd') : 'N/A',
            'Party Name': item.partyName || 'N/A',
            'Amount': item.amount || 0,
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cheques Report");
        XLSX.writeFile(wb, "cheque-book-report.xlsx");
    };
    
    const uniqueBanks = [...new Set(data.map(item => item.bankName))];
    const uniqueBookNos = [...new Set(data.map(item => item.bookNo))];

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                     <div>
                        <CardTitle>Cheque Book Report</CardTitle>
                        <CardDescription>A detailed list of every cheque leaf and its status.</CardDescription>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4"/>PDF</Button>
                        <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4"/>Excel</Button>
                     </div>
                </div>
                 <div className="grid grid-cols-3 gap-4 pt-4">
                     <Select value={filters.bankName} onValueChange={(value) => setFilters(f => ({...f, bankName: value === 'all' ? '' : value}))}>
                        <SelectTrigger><SelectValue placeholder="Filter by Bank..."/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Banks</SelectItem>
                            {uniqueBanks.map(bank => <SelectItem key={bank} value={bank}>{bank}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filters.bookNo} onValueChange={(value) => setFilters(f => ({...f, bookNo: value === 'all' ? '' : value}))}>
                        <SelectTrigger><SelectValue placeholder="Filter by Book No..."/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Books</SelectItem>
                            {uniqueBookNos.map(bookNo => <SelectItem key={bookNo} value={bookNo}>{bookNo}</SelectItem>)}
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
