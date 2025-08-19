
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

// Helper to format camelCase to Title Case
const toTitleCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};


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

  const { unitData, particulars, customFields, customFieldsData, reportConfig } = data;

  const filteredUnitData = Object.entries(unitData).filter(([key]) => reportConfig.unitDetails.includes(key));
  const filteredParticulars = particulars.map((p: any) => {
    const filtered: any = {};
    reportConfig.particulars.forEach((field: string) => {
      filtered[field] = p[field];
    })
    return filtered;
  })
  const filteredCustomFields = customFields.filter((field: any) => reportConfig.customDetails.includes(field.id));

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.text(`Unit Report - ${unitData.unitCode}`, 14, 16);
    
    // Unit Details Table
    if (reportConfig.unitDetails.length > 0) {
        doc.autoTable({
            head: [['Field', 'Value']],
            body: filteredUnitData.map(([key, value]) => [toTitleCase(key), String(value)]),
            startY: yPos,
            didDrawPage: (data) => { yPos = data.cursor?.y || 20; }
        });
        yPos += 10;
    }


    // Particulars Table
    if (reportConfig.particulars.length > 0 && particulars.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.autoTable({
            head: [reportConfig.particulars.map(toTitleCase)],
            body: particulars.map((p: any) => reportConfig.particulars.map((field: string) => {
                const val = p[field];
                return typeof val === 'number' ? val.toFixed(2) : String(val);
            })),
            startY: yPos,
            didDrawPage: (data) => { yPos = data.cursor?.y || 20; }
        });
        yPos += 10;
    }

    // Custom Fields Table
    if (reportConfig.customDetails.length > 0 && filteredCustomFields.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        const customFieldRows = filteredCustomFields.map((field: any) => [
            field.label,
            customFieldsData[field.id] || ''
        ]);
        doc.autoTable({
            head: [['Custom Field', 'Value']],
            body: customFieldRows,
            startY: yPos,
            didDrawPage: (data) => { yPos = data.cursor?.y || 20; }
        });
    }


    doc.save(`report-${unitData.unitCode}.pdf`);
  };

  const handleExportExcel = () => {
     const workbook = XLSX.utils.book_new();

    // Unit Details Sheet
    if (reportConfig.unitDetails.length > 0) {
        const unitDetailsForSheet: any = {};
        filteredUnitData.forEach(([key, value]) => {
            unitDetailsForSheet[toTitleCase(key)] = value;
        });
        const unitWorksheet = XLSX.utils.json_to_sheet([unitDetailsForSheet]);
        XLSX.utils.book_append_sheet(workbook, unitWorksheet, 'Unit Details');
    }

    // Particulars Sheet
    if (reportConfig.particulars.length > 0 && particulars.length > 0) {
        const particularsForSheet = particulars.map((p: any) => {
            const row: any = {};
            reportConfig.particulars.forEach((field: string) => {
                row[toTitleCase(field)] = p[field];
            });
            return row;
        });
        const particularsWorksheet = XLSX.utils.json_to_sheet(particularsForSheet);
        XLSX.utils.book_append_sheet(workbook, particularsWorksheet, 'Particulars');
    }
    
    // Custom Fields Sheet
    if (reportConfig.customDetails.length > 0 && filteredCustomFields.length > 0) {
        const customDataForSheet = filteredCustomFields.map((field: any) => ({
            'Field': field.label,
            'Value': customFieldsData[field.id] || ''
        }));
        const customWorksheet = XLSX.utils.json_to_sheet(customDataForSheet);
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
          {reportConfig.unitDetails.length > 0 && (
             <>
                <h3 className="text-lg font-semibold mb-2">Unit Details</h3>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredUnitData.map(([key, value]) => (
                        <TableRow key={key}>
                        <TableCell className="font-medium">{toTitleCase(key)}</TableCell>
                        <TableCell>{String(value)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </>
          )}

          {reportConfig.particulars.length > 0 && particulars.length > 0 && (
            <>
                <h3 className="text-lg font-semibold mt-6 mb-2">Particulars</h3>
                <Table>
                    <TableHeader>
                    <TableRow>
                        {reportConfig.particulars.map((field: string) => (
                           <TableHead key={field} className={['amount', 'vatAmount', 'totalAmount', 'vatPercentage'].includes(field) ? 'text-right' : ''}>
                                {toTitleCase(field)}
                           </TableHead>
                        ))}
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {particulars.map((p: any, index: number) => (
                        <TableRow key={index}>
                            {reportConfig.particulars.map((field: string) => (
                               <TableCell key={field} className={['amount', 'vatAmount', 'totalAmount', 'vatPercentage'].includes(field) ? 'text-right' : ''}>
                                 {typeof p[field] === 'number' ? p[field].toFixed(2) : String(p[field])}
                               </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </>
          )}


          {reportConfig.customDetails.length > 0 && filteredCustomFields.length > 0 && (
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
                        {filteredCustomFields.map((field: any) => (
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
