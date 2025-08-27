

import Link from 'next/link';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllContracts } from '../contract/actions';
import { promises as fs } from 'fs';
import path from 'path';
import { type Contract } from '../contract/schema';
import { parseISO, differenceInDays } from 'date-fns';

async function getProperties() {
    try {
        const data = await fs.readFile(
            path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json')
        );
        return JSON.parse(data.toString());
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}


function processContracts(contracts: Contract[]): Contract[] {
    const contractsByTenant = new Map<string, Contract[]>();

    // Group contracts by tenant
    for (const contract of contracts) {
        if (!contractsByTenant.has(contract.tenantCode!)) {
            contractsByTenant.set(contract.tenantCode!, []);
        }
        contractsByTenant.get(contract.tenantCode!)!.push(contract);
    }
    
    const processedContracts: Contract[] = [];

    // Process each tenant's contracts
    for (const tenantContracts of contractsByTenant.values()) {
        const sortedContracts = tenantContracts.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        for (let i = 0; i < sortedContracts.length; i++) {
            const current = sortedContracts[i];
            const previous = i > 0 ? sortedContracts[i - 1] : null;

            if (!previous) {
                 if (current.status === 'Renew') {
                    current.periodStatus = 'Orphaned';
                } else {
                    current.periodStatus = 'OK';
                }
            } else {
                const prevEndDate = parseISO(previous.endDate);
                const currStartDate = parseISO(current.startDate);
                const daysDiff = differenceInDays(currStartDate, prevEndDate);

                if (daysDiff === 1) {
                    current.periodStatus = 'OK';
                } else if (daysDiff > 1) {
                    current.periodStatus = 'Gap';
                } else { // daysDiff <= 0
                    current.periodStatus = 'Overlap';
                }
            }
             processedContracts.push(current);
        }
    }
    
    // Return all contracts sorted by contract number for consistent display
    return processedContracts.sort((a,b) => a.contractNo.localeCompare(b.contractNo));
}


export default async function ContractsPage() {
  const contracts = await getAllContracts();
  const processedContracts = processContracts(contracts);
  const properties = await getProperties();
  const propertyLookups = properties.map((p: any) => ({ value: (p.propertyData || p).code, label: (p.propertyData || p).name }));

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Tenancy Contracts</h1>
        <Button asChild>
          <Link href="/tenancy/contract">
            <Plus className="mr-2 h-4 w-4" /> Add New Contract
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={processedContracts} properties={propertyLookups} />
    </div>
  );
}
