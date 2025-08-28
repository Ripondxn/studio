
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { type PropertyOverview } from './actions';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const columns: ColumnDef<PropertyOverview>[] = [
    {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
             <Button asChild variant="link" className="p-0 h-auto font-normal">
                <Link href={`/property/properties?code=${row.original.code}`}>{row.original.code}</Link>
            </Button>
        )
    },
    {
        accessorKey: 'name',
        header: 'Property Name',
    },
    {
        accessorKey: 'propertyType',
        header: 'Type'
    },
     {
        accessorKey: 'totalUnits',
        header: 'Total Units'
    },
     {
        accessorKey: 'occupiedUnits',
        header: 'Occupied Units'
    },
    {
        accessorKey: 'vacantUnits',
        header: 'Vacant Units'
    },
    {
        accessorKey: 'occupancyRate',
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Occupancy
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const rate = row.original.occupancyRate;
            let colorClass = 'bg-primary';
            if (rate < 50) colorClass = 'bg-yellow-500';
            if (rate > 80) colorClass = 'bg-green-500';

            return (
                <div className="flex items-center gap-2">
                    <Progress value={rate} className="h-2 w-24" indicatorClassName={colorClass} />
                    <span>{rate.toFixed(1)}%</span>
                </div>
            )
        }
    },
    {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.status === 'Active' ? 'default' : 'secondary'}>{row.original.status}</Badge>
        )
    }
];
