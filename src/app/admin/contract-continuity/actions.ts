
'use server';

import { getAllContracts } from '@/app/tenancy/contract/actions';
import { type Contract } from '@/app/tenancy/contract/schema';

export async function getProblematicContracts(): Promise<Contract[]> {
    const allContracts = await getAllContracts();

    // Filter for contracts that have a periodStatus that is not 'OK'
    return allContracts.filter(c => c.periodStatus && c.periodStatus !== 'OK');
}
