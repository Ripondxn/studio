
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type ChequeBook } from './schema';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<ChequeBook>[] = [
    {
        accessorKey: 'bankName',
        header: 'Bank Name',
    },
    {
        accessorKey: 'bookNo',
        header: 'Book No',
    },
    {
        accessorKey: 'chequeStartNo',
        header: 'Start No',
    },
    {
        accessorKey: 'chequeEndNo',
        header: 'End No',
    },
    {
        accessorKey: 'noOfLeafs',
        header: 'Total Leafs',
    },
    {
        accessorKey: 'leafsUsed',
        header: 'Leafs Used',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as ChequeBook['status'];
            return <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>;
        },
    },
];
