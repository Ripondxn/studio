
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { VacantPeriod } from './actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const vacantPeriodColumns: ColumnDef<VacantPeriod>[] = [
  {
    accessorKey: 'property',
    header: 'Property',
  },
  {
    accessorKey: 'unitCode',
    header: 'Unit/Room',
    cell: ({row}) => `${row.original.unitCode} ${row.original.roomCode ? ` / ${row.original.roomCode}` : ''}`
  },
  {
    accessorKey: 'vacancyStartDate',
    header: 'Vacancy Start',
    cell: ({ row }) => format(new Date(row.original.vacancyStartDate), 'PP'),
  },
  {
    accessorKey: 'vacancyEndDate',
    header: 'Vacancy End',
    cell: ({ row }) => format(new Date(row.original.vacancyEndDate), 'PP'),
  },
  {
    accessorKey: 'daysVacant',
    header: () => <div className="text-right">Days Vacant</div>,
    cell: ({ row }) => <div className="text-right">{row.original.daysVacant}</div>,
  },
  {
    id: 'relatedContracts',
    header: 'Related Contracts',
    cell: ({row}) => (
        <div className="flex flex-col text-xs">
            {row.original.previousContractNo && (
                 <Button asChild variant="link" className="p-0 h-auto font-normal justify-start">
                    <Link href={`/tenancy/contract?contractNo=${row.original.previousContractNo}`}>
                        Exited: {row.original.previousContractNo}
                    </Link>
                </Button>
            )}
            {row.original.nextContractNo && (
                 <Button asChild variant="link" className="p-0 h-auto font-normal justify-start">
                    <Link href={`/tenancy/contract?contractNo=${row.original.nextContractNo}`}>
                       Entered: {row.original.nextContractNo}
                    </Link>
                </Button>
            )}
        </div>
    )
  }
];
