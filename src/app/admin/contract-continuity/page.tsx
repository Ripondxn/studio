
import { getProblematicContracts } from './actions';
import { ContinuityClient } from './client';
import { type Contract } from '@/app/tenancy/contract/schema';

export default async function ContractContinuityPage() {
    const contracts: Contract[] = await getProblematicContracts();

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Contract Continuity Check</h1>
                    <p className="text-muted-foreground">Review contracts with potential period gaps, overlaps, or orphaned renewals.</p>
                </div>
            </div>
            <ContinuityClient initialContracts={contracts} />
        </div>
    );
}
