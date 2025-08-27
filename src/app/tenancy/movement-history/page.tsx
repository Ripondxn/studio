

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Printer, Loader2, FileSpreadsheet } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { getAllContracts } from '../contract/actions';
import { type Contract } from '../contract/schema';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';

type MovementHistoryItem = {
    date: string;
    details: string;
    tenantName: string;
    tenantCode: string;
    contractNo: string;
    contractStartDate: string;
    daysInPreviousLocation: number | null;
};

export default function TenantMovementHistoryPage() {
    const [history, setHistory] = useState<MovementHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchMovementHistory() {
            const allContracts: Contract[] = await getAllContracts();
            const allMovements: MovementHistoryItem[] = [];

            allContracts.forEach(contract => {
                const movements = contract.paymentSchedule
                    .filter(item => item.chequeNo === 'MOVEMENT')
                    .map((item, index, arr) => {
                        // Find the previous relevant date: either contract start date or the previous move date.
                        const previousMovements = arr.slice(0, index);
                        const lastMoveDate = previousMovements.length > 0 
                            ? parseISO(previousMovements[previousMovements.length - 1].dueDate) 
                            : null;
                        
                        const startDateOfStay = lastMoveDate || parseISO(contract.startDate);
                        const moveOutDate = parseISO(item.dueDate);
                        
                        const daysStayed = differenceInDays(moveOutDate, startDateOfStay);

                        return {
                            date: item.dueDate,
                            details: item.bankName || 'Unknown Movement',
                            tenantName: contract.tenantName,
                            tenantCode: contract.tenantCode || '',
                            contractNo: contract.contractNo,
                            contractStartDate: contract.startDate,
                            daysInPreviousLocation: daysStayed,
                        };
                    });
                allMovements.push(...movements);
            });

            allMovements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setHistory(allMovements);
            setIsLoading(false);
        }
        fetchMovementHistory();
    }, []);

    const filteredHistory = useMemo(() => {
        const lowercasedFilter = filter.toLowerCase();
        if (!lowercasedFilter) return history;
        return history.filter(item => 
            item.tenantName.toLowerCase().includes(lowercasedFilter) ||
            item.tenantCode.toLowerCase().includes(lowercasedFilter)
        );
    }, [history, filter]);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Tenant Movement History</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; font-size: 9pt; } h1, h2 { text-align: center; } .no-print { display: none; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>Global Tenant Movement History</h1>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
        }
    };
    
    const handleExportExcel = () => {
        const dataToExport = filteredHistory.map(item => ({
            'Movement Date': format(new Date(item.date), 'PP'),
            'Tenant Name': item.tenantName,
            'Tenant Code': item.tenantCode,
            'Contract Start Date': format(new Date(item.contractStartDate), 'PP'),
            'Movement Details': item.details,
            'Days In Previous Location': item.daysInPreviousLocation
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Movement History");
        XLSX.writeFile(wb, "tenant-movement-history.xlsx");
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Global Tenant Movement History</CardTitle>
                            <CardDescription>A log of all tenant relocations across all properties.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                             <Input 
                                placeholder="Filter by tenant name or code..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="max-w-sm"
                            />
                            <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                            <Button variant="outline" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div ref={printRef}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Movement Date</TableHead>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Contract Start</TableHead>
                                    <TableHead>Movement Details</TableHead>
                                    <TableHead className="text-right">Days In Previous</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary"/>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredHistory.length > 0 ? (
                                    filteredHistory.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{format(new Date(item.date), 'PP')}</TableCell>
                                            <TableCell>
                                                <div>{item.tenantName}</div>
                                                <div className="text-xs text-muted-foreground">{item.tenantCode}</div>
                                            </TableCell>
                                            <TableCell>{format(new Date(item.contractStartDate), 'PP')}</TableCell>
                                            <TableCell>{item.details}</TableCell>
                                            <TableCell className="text-right">{item.daysInPreviousLocation !== null ? `${item.daysInPreviousLocation} days` : 'N/A'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No movement history found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
