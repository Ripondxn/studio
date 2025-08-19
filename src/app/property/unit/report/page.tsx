
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend the jsPDF type to include the autoTable method
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}


function Report() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dataString = searchParams.get('data');
  const data = dataString ? JSON.parse(decodeURIComponent(dataString)) : null;

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No data provided for the report.</p>
      </div>
    );
  }

  const { unitData, particulars, customFields, customFieldsData } = data;

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.text(`Unit Report - ${unitData.unitCode}`, 14, 16);
    
    // Unit Details Table
    const unitDetails = Object.entries(unitData).map(([key, value]) => [key, String(value)]);
    doc.autoTable({
      head: [['Field', 'Value']],
      body: unitDetails,
      startY: yPos,
      didDrawPage: (data) => { yPos = data.cursor?.y || 20; }
    });

    // Particulars Table
    if (particulars && particulars.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.autoTable({
            head: [['Particulars', 'Amount', 'VAT %', 'VAT Amount', 'Total Amount']],
            body: particulars.map((p: any) => [
            p.particulars,
            p.amount,
            p.vatPercentage,
            p.vatAmount.toFixed(2),
            p.totalAmount.toFixed(2),
            ]),
            startY: yPos + 10,
            didDrawPage: (data) => { yPos = data.cursor?.y || 20; }
        });
    }

    // Custom Fields Table
    if (customFields && customFields.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        const customFieldRows = customFields.map((field: any) => [
            field.label,
            customFieldsData[field.id] || ''
        ]);
        doc.autoTable({
            head: [['Custom Field', 'Value']],
            body: customFieldRows,
            startY: yPos + 10,
            didDrawPage: (data) => { yPos = data.cursor?.y || 20; }
        });
    }


    doc.save(`report-${unitData.unitCode}.pdf`);
  };

  const handleExportExcel = () => {
    const unitWorksheet = XLSX.utils.json_to_sheet([unitData]);
    const particularsWorksheet = XLSX.utils.json_to_sheet(particulars);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, unitWorksheet, 'Unit Details');
    XLSX.utils.book_append_sheet(workbook, particularsWorksheet, 'Particulars');
    
    if (customFields && customFields.length > 0) {
        const customData = customFields.map((field: any) => ({
            Label: field.label,
            Value: customFieldsData[field.id] || ''
        }));
        const customWorksheet = XLSX.utils.json_to_sheet(customData);
        XLSX.utils.book_append_sheet(workbook, customWorksheet, 'Custom Details');
    }


    XLSX.writeFile(workbook, `report-${unitData.unitCode}.xlsx`);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Unit Report: {unitData.unitCode}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            <Button onClick={handleExportPDF}>
              <FileText className="mr-2 h-4 w-4" /> Export to PDF
            </Button>
            <Button onClick={handleExportExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Export to Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Unit Details</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(unitData).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</TableCell>
                  <TableCell>{String(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold mt-6 mb-2">Particulars</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Particulars</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">VAT %</TableHead>
                <TableHead className="text-right">VAT Amount</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {particulars.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.particulars}</TableCell>
                  <TableCell className="text-right">{p.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{p.vatPercentage}</TableCell>
                  <TableCell className="text-right">{p.vatAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{p.totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {customFields && customFields.length > 0 && (
            <>
                <h3 className="text-lg font-semibold mt-6 mb-2">Custom Details</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Field</TableHead>
                            <TableHead>Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customFields.map((field: any) => (
                            <TableRow key={field.id}>
                                <TableCell className="font-medium">{field.label}</TableCell>
                                <TableCell>
                                    {customFieldsData[field.id] ? 
                                        (typeof customFieldsData[field.id] === 'object' ? 'File Attachment' : String(customFieldsData[field.id]))
                                        : 'N/A'
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

export default function ReportPage() {
    return (
        <Suspense fallback={<div>Loading Report...</div>}>
            <Report />
        </Suspense>
    )
}
