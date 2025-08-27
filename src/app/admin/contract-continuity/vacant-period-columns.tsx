
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { VacantPeriod } from './actions';

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
];
