
import { promises as fs } from 'fs';
import path from 'path';
import { type Unit } from '../schema';
import { type Contract } from '@/app/tenancy/contract/schema';
import { DataTable } from './data-table';
import { columns } from './columns';
import { getUnits } from '../actions';

async function getVacantUnits(): Promise<Unit[]> {
    const allUnits = await getUnits();
    return allUnits.filter(unit => unit.occupancyStatus === 'Vacant');
}

export default async function VacantUnitsPage() {
  const vacantUnits = await getVacantUnits();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Vacant Units</h1>
            <p className="text-muted-foreground">
                A list of all currently available units across all properties.
            </p>
        </div>
      </div>
      <DataTable columns={columns} data={vacantUnits} />
    </div>
  );
}

