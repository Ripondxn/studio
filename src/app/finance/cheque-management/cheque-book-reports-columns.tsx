
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type ChequeLeaf } from './schema';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<ChequeLeaf>[] = [
    {
        accessorKey: 'chequeNo',
        header: 'Cheque No',
    },
    {
        accessorKey: 'bookNo',
        header: 'Book No',
    },
    {
        accessorKey: 'bankName',
        header: 'Bank Name',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as ChequeLeaf['status'];
            return <Badge variant={status === 'Used' ? 'secondary' : 'default'}>{status}</Badge>;
        },
    },
    {
        accessorKey: 'date',
        header: 'Date',
    },
    {
        accessorKey: 'partyCode',
        header: 'Party Code',
    },
    {
        accessorKey: 'partyName',
        header: 'Party Name',
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
    },
    {
        accessorKey: 'property',
        header: 'Property',
    },
    {
        accessorKey: 'unitCode',
        header: 'Unit Code',
    },
    {
        accessorKey: 'roomCode',
        header: 'Room Code',
    },
];
