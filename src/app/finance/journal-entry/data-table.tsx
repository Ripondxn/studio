
'use client';

import { DataTable } from '@/components/data-table';
import { type ColumnDef } from '@tanstack/react-table';

interface JournalEntryDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function JournalEntryDataTable<TData, TValue>({ columns, data }: JournalEntryDataTableProps<TData, TValue>) {
  return <DataTable columns={columns} data={data} filterKeys={[{label: "Description", value: "description"}]} />;
}
