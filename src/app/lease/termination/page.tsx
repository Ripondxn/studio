
'use client';

import { DataTable } from "./data-table";
import { columns } from "./columns";

// This is a placeholder for the data you would fetch.
const data: any[] = [];

export default function LeaseTerminationPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Lease Termination</h1>
            <p className="text-muted-foreground">
                Manage and process lease contract terminations.
            </p>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
