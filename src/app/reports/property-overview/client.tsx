
'use client';

import { useState, useEffect, useMemo } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { type PropertyOverview } from './actions';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function PropertyOverviewClient({ initialProperties }: { initialProperties: PropertyOverview[] }) {
    const [properties, setProperties] = useState(initialProperties);
    
    useEffect(() => {
        setProperties(initialProperties);
    }, [initialProperties]);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Property-wise Overview Report", 14, 16);
        (doc as any).autoTable({
            head: [['Code', 'Name', 'Type', 'Total Units', 'Occupied', 'Vacant', 'Occupancy Rate']],
            body: properties.map(p => [
                p.code,
                p.name,
                p.propertyType,
                p.totalUnits,
                p.occupiedUnits,
                p.vacantUnits,
                `${p.occupancyRate.toFixed(2)}%`
            ]),
            startY: 20,
        });
        doc.save('property-overview-report.pdf');
    };

    const handleExportExcel = () => {
        const dataToExport = properties.map(p => ({
            'Code': p.code,
            'Name': p.name,
            'Type': p.propertyType,
            'Total Units': p.totalUnits,
            'Occupied Units': p.occupiedUnits,
            'Vacant Units': p.vacantUnits,
            'Total Rooms': p.totalRooms,
            'Occupied Rooms': p.occupiedRooms,
            'Vacant Rooms': p.vacantRooms,
            'Occupancy Rate (%)': p.occupancyRate.toFixed(2),
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Property Overview");
        XLSX.writeFile(wb, "property-overview.xlsx");
    };

    return (
        <div className="container mx-auto py-10">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Property-wise Overview</h1>
                    <p className="text-muted-foreground">A high-level summary of all your properties.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
                    <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
                </div>
            </div>
            <DataTable columns={columns} data={properties} />
        </div>
    );
}
