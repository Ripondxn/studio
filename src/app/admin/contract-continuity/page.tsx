
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProblematicContracts, getMovementHistory, getVacantPeriods } from './actions';
import { ContinuityClient } from './client';
import { type Contract } from '@/app/tenancy/contract/schema';
import { type MovementHistoryItem, type VacantPeriod } from './actions';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { Loader2 } from 'lucide-react';

type ContinuityData = {
    problematicContracts: Contract[],
    movementHistory: MovementHistoryItem[],
    vacantPeriods: VacantPeriod[],
}

export default function ContractContinuityPage() {
  const [data, setData] = useState<ContinuityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

   useEffect(() => {
    const checkAuthAndFetchData = async () => {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            const profile: { role: UserRole['role'] } = JSON.parse(storedProfile);
            if (profile.role === 'Super Admin') {
                setIsAuthorized(true);
                const problematicContracts = await getProblematicContracts();
                const movementHistory = await getMovementHistory();
                const vacantPeriods = await getVacantPeriods();
                setData({ problematicContracts, movementHistory, vacantPeriods });
            } else {
                router.push('/');
            }
        } else {
            router.push('/login');
        }
        setIsLoading(false);
    };

    checkAuthAndFetchData();
  }, [router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const { problematicContracts, movementHistory, vacantPeriods } = data!;
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
        initialVacantPeriods={vacantPeriods}
      />
    </div>
  );
}
