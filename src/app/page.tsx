
import { promises as fs } from 'fs';
import path from 'path';
import { differenceInDays, parseISO } from 'date-fns';
import { getAllContracts } from '@/app/tenancy/contract/actions';
import { getUnits } from '@/app/property/units/actions';
import { getAllTenants } from '@/app/tenancy/tenants/actions';
import { Contract } from '@/app/tenancy/contract/schema';
import { Unit } from '@/app/property/units/schema';
import { DashboardClient } from './dashboard-client';
import { type LeaseContract } from '@/app/lease/contract/schema';
import { getBankAccounts } from '@/app/finance/banking/actions';
import { getMovementHistory } from './admin/contract-continuity/actions';
import { type Room } from '@/app/property/rooms/schema';

function getExpiryReport(contracts: Contract[]) {
    const today = new Date();
    
    const expiringSoon = contracts.filter(contract => {
        const daysRemaining = differenceInDays(parseISO(contract.endDate), today);
        return daysRemaining >= 0 && daysRemaining <= 30;
    });

    const uniqueContracts = new Map<string, Contract>();
    for (const contract of expiringSoon) {
        if (!uniqueContracts.has(contract.contractNo)) {
            uniqueContracts.set(contract.contractNo, contract);
        }
    }
    
    return Array.from(uniqueContracts.values());
}

function getDashboardData(
    contracts: Contract[],
    allUnits: Unit[],
    tenants: any[],
    allProperties: any[],
    allRooms: Room[],
    allLeaseContracts: LeaseContract[]
) {
    const activeContracts = contracts.filter(c => c.status === 'New' || c.status === 'Renew');
    const occupiedUnitCodes = new Set(activeContracts.filter(c => !c.roomCode).map(c => c.unitCode));
    const occupiedRoomCodes = new Set(activeContracts.filter(c => c.roomCode).map(c => c.roomCode));

    const vacantUnitsCount = allUnits.filter(unit => 
        unit.unitStatus === 'Active' && !occupiedUnitCodes.has(unit.unitCode) && allRooms.every(r => r.unitCode !== unit.unitCode)
    ).length;
    
    const vacantRoomsCount = allRooms.filter(room => !occupiedRoomCodes.has(room.roomCode)).length;

    const totalUnits = allUnits.length;
    const totalRooms = allRooms.length;
    
    const today = new Date();
    const expiringSoonCount = contracts.filter(contract => {
        const daysRemaining = differenceInDays(parseISO(contract.endDate), today);
        return daysRemaining >= 0 && daysRemaining <= 30;
    }).length;

    const leaseExpiringSoonCount = allLeaseContracts.filter(contract => {
        const daysRemaining = differenceInDays(parseISO(contract.endDate), today);
        return daysRemaining >= 0 && daysRemaining <= 30;
    }).length;

    return {
        vacantUnitsCount,
        totalUnits,
        vacantRoomsCount,
        totalRooms,
        expiringSoonCount,
        leaseExpiringSoonCount,
        totalTenants: tenants.length,
        totalProperties: allProperties.length,
    };
}


export default async function DashboardPage() {
    const [
        contracts,
        allUnits,
        tenants,
        propertiesData,
        allRoomsData,
        leaseContractsData,
        bankAccounts,
        movementHistory
    ] = await Promise.all([
        getAllContracts(),
        getUnits(),
        getAllTenants(),
        fs.readFile(path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json')),
        fs.readFile(path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json'), 'utf-8').catch(() => '[]'),
        fs.readFile(path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json'), 'utf-8').catch(() => '[]'),
        getBankAccounts(),
        getMovementHistory()
    ]);

    const allProperties = JSON.parse(propertiesData.toString());
    const allRooms: Room[] = JSON.parse(allRoomsData as string);
    const allLeaseContracts: LeaseContract[] = JSON.parse(leaseContractsData as string);

    const dashboardData = getDashboardData(contracts, allUnits, tenants, allProperties, allRooms, allLeaseContracts);
    const expiringContracts = getExpiryReport(contracts);

    return (
        <DashboardClient
            initialDashboardData={dashboardData}
            initialExpiringContracts={expiringContracts}
            initialBankAccounts={bankAccounts}
            initialMovementHistoryCount={movementHistory.length}
        />
    );
}
