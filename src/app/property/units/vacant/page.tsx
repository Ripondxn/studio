
import { promises as fs } from 'fs';
import path from 'path';
import { type Unit } from '../schema';
import { type Contract } from '@/app/tenancy/contract/schema';
import { DataTable } from './data-table';
import { columns } from './columns';

async function getVacantUnits(): Promise<Unit[]> {
    const unitsData = await fs.readFile(path.join(process.cwd(), 'src/app/property/units/units-data.json'), 'utf-8');
    const allUnits: Unit[] = JSON.parse(unitsData);

    const contractsData = await fs.readFile(path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json'), 'utf-8');
    const allContracts: Contract[] = JSON.parse(contractsData);

    const activeContractUnitCodes = new Set(
        allContracts
            .filter(c => c.status === 'New' || c.status === 'Renew')
            .map(c => c.unitCode)
    );

    const vacantUnits = allUnits.filter(unit => 
        unit.unitStatus === 'Active' && !activeContractUnitCodes.has(unit.unitCode)
    );

    return vacantUnits;
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
