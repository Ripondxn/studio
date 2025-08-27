
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
import { Printer } from 'lucide-react';
import { format } from 'date-fns';
import { getAllContracts } from '../contract/actions';
import { type Contract, type PaymentInstallment } from '../contract/schema';

type MovementHistoryItem = {
    date: string;
    details: string;
    tenantName: string;
    contractNo: string;
};

export default function TenantMovementHistoryPage() {
    const [history, setHistory] = useState<MovementHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchMovementHistory() {
            const allContracts: Contract[] = await getAllContracts();
            const allMovements: MovementHistoryItem[] = [];

            allContracts.forEach(contract => {
                const movements = contract.paymentSchedule
                    .filter(item => item.chequeNo === 'MOVEMENT')
                    .map(item => ({
                        date: item.dueDate,
                        details: item.bankName || 'Unknown Movement',
                        tenantName: contract.tenantName,
                        contractNo: contract.contractNo,
                    }));
                allMovements.push(...movements);
            });

            allMovements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setHistory(allMovements);
            setIsLoading(false);
        }
        fetchMovementHistory();
    }, []);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Tenant Movement History</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } h1, h2 { text-align: center; } .no-print { display: none; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>Global Tenant Movement History</h1>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Global Tenant Movement History</CardTitle>
                        <CardDescription>A log of all tenant relocations across all properties.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print History</Button>
                </CardHeader>
                <CardContent>
                    <div ref={printRef}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Movement Date</TableHead>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Contract No</TableHead>
                                    <TableHead>Movement Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Loading movement history...
                                        </TableCell>
                                    </TableRow>
                                ) : history.length > 0 ? (
                                    history.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{format(new Date(item.date), 'PP')}</TableCell>
                                            <TableCell>{item.tenantName}</TableCell>
                                            <TableCell>{item.contractNo}</TableCell>
                                            <TableCell>{item.details}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
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
