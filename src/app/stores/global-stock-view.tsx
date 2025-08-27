'use client';

import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { getAggregatedStock } from './actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AggregatedStockItem {
    productId: string;
    itemName: string;
    itemCode: string;
    totalQuantity: number;
    locations: {
        storeName: string;
        quantity: number;
    }[];
}

export function GlobalStockView() {
    const [stock, setStock] = useState<AggregatedStockItem[]>([]);
    const [filteredStock, setFilteredStock] = useState<AggregatedStockItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getAggregatedStock().then(data => {
            setStock(data);
            setFilteredStock(data);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        const lowercasedFilter = filter.toLowerCase();
        const filteredData = stock.filter(item => 
            item.itemName.toLowerCase().includes(lowercasedFilter) ||
            item.itemCode.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredStock(filteredData);
    }, [filter, stock]);
    
      const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Global Stock Report", 14, 16);
        (doc as any).autoTable({
            head: [['Item Code', 'Item Name', 'Total Quantity', 'Locations']],
            body: filteredStock.map(item => [
                item.itemCode,
                item.itemName,
                item.totalQuantity,
                item.locations.map(loc => `${loc.storeName}: ${loc.quantity}`).join(', ')
            ]),
            startY: 20,
        });
        doc.save('global-stock-report.pdf');
      };

      const handleExportExcel = () => {
        const dataToExport = filteredStock.map(item => ({
            'Item Code': item.itemCode,
            'Item Name': item.itemName,
            'Total Quantity': item.totalQuantity,
            'Locations': item.locations.map(loc => `${loc.storeName}: ${loc.quantity}`).join(', ')
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Global Stock");
        XLSX.writeFile(wb, "global-stock-report.xlsx");
      };
      
      const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
          const printWindow = window.open('', '_blank');
          if(printWindow) {
            printWindow.document.write('<html><head><title>Global Stock Report</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } h1 { text-align: center; } .no-print { display: none !important; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>Global Stock Report</h1>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
          }
        }
      };


    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Global Stock View</CardTitle>
                        <CardDescription>An aggregated view of all items across all stores.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                        <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
                        <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Input 
                        placeholder="Filter by item name or code..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                 {isLoading ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="h-6 w-6 animate-spin"/></div>
                ) : (
                    <div className="h-96 overflow-y-auto border rounded-md" ref={printRef}>
                        <Table>
                            <TableHeader className="sticky top-0 bg-background">
                                <TableRow>
                                    <TableHead>Item Code</TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead className="text-right">Total Quantity</TableHead>
                                    <TableHead>Locations</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStock.length > 0 ? filteredStock.map(item => (
                                    <TableRow key={item.productId}>
                                        <TableCell>{item.itemCode}</TableCell>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell className="text-right font-bold">{item.totalQuantity}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                            {item.locations.map(loc => (
                                                <Badge key={loc.storeName} variant="secondary">
                                                    {loc.storeName}: {loc.quantity}
                                                </Badge>
                                            ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">No stock found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
