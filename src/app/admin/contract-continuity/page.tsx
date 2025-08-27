
import { getProblematicContracts, getMovementHistory } from './actions';
import { ContinuityClient } from './client';

export default async function ContractContinuityPage() {
  const problematicContracts = await getProblematicContracts();
  const movementHistory = await getMovementHistory();

  const overlapContracts = problematicContracts.filter(c => c.periodStatus === 'Overlap');
  const gapContracts = problematicContracts.filter(c => c.periodStatus === 'Gap');


  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">
          Contract Continuity & Movements
        </h1>
        <p className="text-muted-foreground">
          Review tenant contract history for potential data issues or view tenant relocations.
        </p>
      </div>
      <ContinuityClient 
        initialOverlapContracts={overlapContracts} 
        initialGapContracts={gapContracts}
        initialMovementHistory={movementHistory}
      />
    </div>
  );
}
