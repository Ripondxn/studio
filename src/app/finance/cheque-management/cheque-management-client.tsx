
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/data-table';
import { columns } from './cheque-management-columns';
import { type Cheque } from './schema';

interface ChequeManagementClientProps {
    initialCheques: Cheque[];
    isLoading: boolean;
}

export function ChequeManagementClient({ initialCheques, isLoading }: ChequeManagementClientProps) {
    return (
        <div>
            <DataTable columns={columns} data={initialCheques} />
        </div>
    );
}
