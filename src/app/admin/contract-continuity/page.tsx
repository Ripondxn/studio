
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProblematicContracts, getMovementHistory, getVacantPeriods } from './actions';
import { ContinuityClient } from './client';
import { type Contract } from '@/app/tenancy/contract/schema';
import { type MovementHistoryItem, type VacantPeriod } from './actions';
import { Loader2 } from 'lucide-react';
import { useAuthorization } from '@/hooks/useAuthorization';

type ContinuityData = {
    problematicContracts: Contract[],
    movementHistory: MovementHistoryItem[],
    vacantPeriods: VacantPeriod[],
}

export default function ContractContinuityPage() {
  const [data, setData] = useState<ContinuityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isAuthorized, isLoading: isAuthLoading } = useAuthorization();

   useEffect(() => {
    if (isAuthLoading) return;

    const fetchData = async () => {
        if (!isAuthorized('Settings', 'contract_continuity')) {
            router.push('/');
            return;
        }
        
        try {
            const [problematicContracts, movementHistory, vacantPeriods] = await Promise.all([
                getProblematicContracts(),
                getMovementHistory(),
                getVacantPeriods()
            ]);
            setData({ problematicContracts, movementHistory, vacantPeriods });
        } catch (error) {
            console.error("Failed to fetch continuity data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, [isAuthLoading, isAuthorized, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!isAuthorized('Settings', 'contract_continuity')) {
      return (
          <div className="text-center text-muted-foreground">
              <p>You are not authorized to view this page.</p>
          </div>
      )
  }

  const { problematicContracts, movementHistory, vacantPeriods } = data!;
  const overlapContracts = problematicContracts.filter(c => c.periodStatus === 'Overlap');
  const gapContracts = problematicContracts.filter(c => c.periodStatus === 'Gap');

  return (
    <div className="w-full">
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
        initialVacantPeriods={vacantPeriods}
      />
    </div>
  );
}
