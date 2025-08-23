
'use client';

import { ColumnDef } from "@tanstack/react-table";

// This is a placeholder for the columns.
// You can define the actual columns based on the data you want to display.
export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "contractNo",
        header: "Contract No",
    },
    {
        accessorKey: "tenantName",
        header: "Tenant Name",
    },
    {
        accessorKey: "terminationDate",
        header: "Termination Date",
    },
    {
        accessorKey: "status",
        header: "Status",
    }
];
