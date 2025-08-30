

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { type Role, type Status } from '../types';
import type { DocumentForApproval } from './schema';
import { getDocumentsForApproval } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddDocumentDialog } from './add-dialog';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export default function DocumentApprovalPage() {
    const [documents, setDocuments] = useState<DocumentForApproval[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<UserRole | null>(null);
    const router = useRouter();

    const [docTypeFilter, setDocTypeFilter] = useState('');
    const [refNoFilter, setRefNoFilter] = useState('');
    const [submittedByFilter, setSubmittedByFilter] = useState('');

    const refreshData = useCallback(async (user: UserRole) => {
        setIsLoading(true);
        const data = await getDocumentsForApproval(user);
        setDocuments(data);
        setIsLoading(false);
    }, []);
    
    useEffect(() => {
        const userProfile = sessionStorage.getItem('userProfile');
        if (userProfile) {
            const parsedProfile = JSON.parse(userProfile);
            setCurrentUser(parsedProfile);
            refreshData(parsedProfile);
        } else {
            router.push('/login');
        }
    }, [router, refreshData]);

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const docTypeMatch = docTypeFilter ? doc.docType.toLowerCase().includes(docTypeFilter.toLowerCase()) : true;
            const refNoMatch = refNoFilter ? doc.referenceNo.toLowerCase().includes(refNoFilter.toLowerCase()) : true;
            const submittedByMatch = submittedByFilter ? doc.submittedBy.toLowerCase().includes(submittedByFilter.toLowerCase()) : true;
            return docTypeMatch && refNoMatch && submittedByMatch;
        });
    }, [documents, docTypeFilter, refNoFilter, submittedByFilter]);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Document Approval Workflow Report", 14, 16);
        (doc as any).autoTable({
            head: [['Doc Type', 'Reference No', 'Date', 'Submitted By', 'Status']],
            body: filteredDocuments.map(d => [
                d.docType,
                d.referenceNo,
                format(new Date(d.date), 'PP'),
                d.submittedBy,
                d.currentStatus
            ]),
            startY: 20,
        });
        doc.save('document-approval-report.pdf');
    };

    const handleExportExcel = () => {
        const dataToExport = filteredDocuments.map(d => ({
            'Document Type': d.docType,
            'Reference No': d.referenceNo,
            'Date': format(new Date(d.date), 'yyyy-MM-dd'),
            'Submitted By': d.submittedBy,
            'Status': d.currentStatus,
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Document Approvals");
        XLSX.writeFile(wb, "document-approvals.xlsx");
    };
    
    if (!currentUser) {
        return <div>Loading...</div>; // Or a spinner
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Document Approval Workflow</h1>
                    <p className="text-muted-foreground">
                        Manage and track physical documents through the approval process.
                    </p>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4"/>PDF</Button>
                    <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4"/>Excel</Button>
                    <AddDocumentDialog 
                        currentUser={currentUser} 
                        onSuccess={() => refreshData(currentUser)} 
                    />
                 </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg bg-card">
                 <div>
                    <Label htmlFor="docTypeFilter">Document Type</Label>
                    <Input id="docTypeFilter" value={docTypeFilter} onChange={e => setDocTypeFilter(e.target.value)} placeholder="Filter by type..." />
                </div>
                 <div>
                    <Label htmlFor="refNoFilter">Reference No.</Label>
                    <Input id="refNoFilter" value={refNoFilter} onChange={e => setRefNoFilter(e.target.value)} placeholder="Filter by reference..."/>
                </div>
                 <div>
                    <Label htmlFor="submittedByFilter">Submitted By</Label>
                    <Input id="submittedByFilter" value={submittedByFilter} onChange={e => setSubmittedByFilter(e.target.value)} placeholder="Filter by user..."/>
                </div>
            </div>

            <DataTable 
                columns={columns({ currentUser: currentUser, onUpdate: () => refreshData(currentUser) })}
                data={filteredDocuments}
                isLoading={isLoading}
            />
        </div>
    )
}
