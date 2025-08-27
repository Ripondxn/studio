import { getProblematicContracts } from './actions';
import { ContinuityClient } from './client';
import { type Contract } from '@/app/tenancy/contract/schema';

export default async function ContractContinuityPage() {
  const contracts: Contract[] = await getProblematicContracts();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">
          Contract Continuity Check
        </h1>
        <p className="text-muted-foreground">
          Review tenancy contracts with potential gaps or overlaps in their
          renewal periods.
        </p>
      </div>
      <ContinuityClient initialContracts={contracts} />
    </div>
  );
}
