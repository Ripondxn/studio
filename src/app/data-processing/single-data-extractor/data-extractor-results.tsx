
'use client';

import React from 'react';
import * as XLSX from 'xlsx';
import { ProcessedDocument } from '@/ai/flows/process-document-flow';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCurrency } from '@/context/currency-context';
import { FileSpreadsheet } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface DataExtractorResultsProps {
  processedData: ProcessedDocument;
  fileName: string;
}

export function DataExtractorResults({ processedData, fileName }: DataExtractorResultsProps) {
    const { formatCurrency } = useCurrency();

    const handleExportExcel = () => {
        const mainData = [{
            'Document Type': processedData.documentType,
            'Vendor Name': processedData.vendorName,
            'Customer Name': processedData.customerName,
            'Date': processedData.date ? format(parseISO(processedData.date), 'PP') : '',
            'Due Date': processedData.dueDate ? format(parseISO(processedData.dueDate), 'PP') : '',
            'VAT/TRN No': processedData.vatRegNo,
            'Subtotal': processedData.subTotal,
            'Tax': processedData.tax,
            'Total': processedData.total,
        }];

        const itemsData = processedData.items.map(item => ({
            'Description': item.description,
            'Quantity': item.quantity,
            'Unit Price': item.unitPrice,
            'Line Total': item.total,
        }));

        const wsMain = XLSX.utils.json_to_sheet(mainData);
        const wsItems = XLSX.utils.json_to_sheet(itemsData);
        
        const sanitizedFileName = fileName.replace(/[\/\\?*\[\]]/g, '').substring(0, 31);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsMain, `${sanitizedFileName.substring(0,25)}-Sum`);
        XLSX.utils.book_append_sheet(wb, wsItems, `${sanitizedFileName.substring(0,24)}-Items`);
        XLSX.writeFile(wb, `extracted-${sanitizedFileName}.xlsx`);
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Extracted Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Document Type</p>
                        <p className="font-medium">{processedData.documentType}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="text-muted-foreground">Vendor Name</p>
                        <p className="font-medium">{processedData.vendorName || 'N/A'}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="text-muted-foreground">Customer Name</p>
                        <p className="font-medium">{processedData.customerName || 'N/A'}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{processedData.date ? format(parseISO(processedData.date), 'PP') : 'N/A'}</p>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processedData.items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                 <div className="flex justify-end mt-4">
                  <div className="w-full max-w-xs space-y-2 text-sm">
                      <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium text-gray-800">{formatCurrency(processedData.subTotal || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-medium text-gray-800">{formatCurrency(processedData.tax || 0)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="font-bold text-gray-800 text-base">Total:</span>
                          <span className="font-bold text-gray-800 text-base">{formatCurrency(processedData.total)}</span>
                      </div>
                  </div>
              </div>

            </CardContent>
            <CardFooter>
                <Button onClick={handleExportExcel}>
                    <FileSpreadsheet className="mr-2 h-4 w-4"/>
                    Export to Excel
                </Button>
            </CardFooter>
        </Card>
    );
}
