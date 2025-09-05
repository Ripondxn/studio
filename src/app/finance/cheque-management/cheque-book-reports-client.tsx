
'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './cheque-book-reports-columns';
import { type ChequeLeaf } from './schema';
import { Loader2 } from 'lucide-react';

interface ChequeBookReportsClientProps {
    initialReportData: ChequeLeaf[];
    isLoading: boolean;
}

export function ChequeBookReportsClient({ initialReportData, isLoading }: ChequeBookReportsClientProps) {
    if (isLoading) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <DataTable columns={columns} data={initialReportData} />;
}
