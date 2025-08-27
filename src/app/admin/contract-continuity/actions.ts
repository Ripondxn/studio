
'use server';

import {promises as fs} from 'fs';
import path from 'path';
import {revalidatePath} from 'next/cache';
import {type Contract} from '@/app/tenancy/contract/schema';
import {differenceInDays, parseISO} from 'date-fns';

const contractsFilePath = path.join(
  process.cwd(),
  'src/app/tenancy/contract/contracts-data.json'
);

async function readContracts(): Promise<Contract[]> {
  try {
    await fs.access(contractsFilePath);
    const data = await fs.readFile(contractsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function getProblematicContracts(): Promise<Contract[]> {
  const contracts = await readContracts();

  // Sort contracts by tenant and then by start date to check for continuity
  const sortedContracts = [...contracts].sort((a, b) => {
    if (a.tenantCode! < b.tenantCode!) return -1;
    if (a.tenantCode! > b.tenantCode!) return 1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const contractsWithStatus = sortedContracts.map((contract, index) => {
    let periodStatus: 'OK' | 'Gap' | 'Overlap' = 'OK';

    const previousContract = sortedContracts[index - 1];

    // Check continuity only if it's the same tenant and unit/room
    if (
      previousContract &&
      previousContract.tenantCode === contract.tenantCode &&
      previousContract.property === contract.property &&
      previousContract.unitCode === contract.unitCode &&
      previousContract.roomCode === contract.roomCode
    ) {
      const prevEndDate = parseISO(previousContract.endDate);
      const currentStartDate = parseISO(contract.startDate);
      const daysBetween = differenceInDays(currentStartDate, prevEndDate);

      if (daysBetween > 1) {
        periodStatus = 'Gap';
      } else if (daysBetween < 1) {
        periodStatus = 'Overlap';
      }
    }

    return {
      ...contract,
      periodStatus,
    };
  });

  // Filter for only problematic contracts
  return contractsWithStatus.filter(
    c => c.periodStatus === 'Overlap' || c.periodStatus === 'Gap'
  );
}


export type MovementHistoryItem = {
    date: string;
    details: string;
    tenantName: string;
    tenantCode: string;
    contractNo: string;
    contractStartDate: string;
    daysInPreviousLocation: number | null;
};

export async function getMovementHistory(): Promise<MovementHistoryItem[]> {
    const allContracts: Contract[] = await readContracts();
    const allMovements: MovementHistoryItem[] = [];

    allContracts.forEach(contract => {
        const movements = contract.paymentSchedule
            .filter(item => item.chequeNo === 'MOVEMENT')
            .map((item, index, arr) => {
                const previousMovements = arr.slice(0, index);
                const lastMoveDate = previousMovements.length > 0 
                    ? parseISO(previousMovements[previousMovements.length - 1].dueDate) 
                    : null;
                
                const startDateOfStay = lastMoveDate || parseISO(contract.startDate);
                const moveOutDate = parseISO(item.dueDate);
                
                const daysStayed = differenceInDays(moveOutDate, startDateOfStay);

                return {
                    date: item.dueDate,
                    details: item.bankName || 'Unknown Movement',
                    tenantName: contract.tenantName,
                    tenantCode: contract.tenantCode || '',
                    contractNo: contract.contractNo,
                    contractStartDate: contract.startDate,
                    daysInPreviousLocation: daysStayed,
                };
            });
        allMovements.push(...movements);
    });

    allMovements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return allMovements;
}

