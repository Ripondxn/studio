
import { promises as fs } from 'fs';
import path from 'path';
import { differenceInDays, parseISO, format, getMonth, getYear, isFuture } from 'date-fns';
import { getAllContracts } from '@/app/tenancy/contract/actions';
import { getUnits } from '@/app/property/units/actions';
import { getAllTenants } from '@/app/tenancy/tenants/actions';
import { Contract } from '@/app/tenancy/contract/schema';
import { Unit } from '@/app/property/units/schema';
import { DashboardClient } from './dashboard-client';
import { type LeaseContract } from '@/app/lease/contract/schema';
import { type Cheque } from '@/app/finance/cheque-deposit/schema';
import { getBankAccounts } from '@/app/finance/banking/actions';
import { getMovementHistory } from './admin/contract-continuity/actions';
import { type Room } from '@/app/property/rooms/schema';

async function getExpiryReport() {
    const contracts = await getAllContracts();
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

async function getDashboardData() {
    const contracts = await getAllContracts();
    const allUnits = await getUnits();
    const tenants = await getAllTenants();
    
    const propertiesData = await fs.readFile(
      path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json')
    );
    const allProperties = JSON.parse(propertiesData.toString());
    const allRoomsData = await fs.readFile(
        path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json'), 'utf-8'
    ).catch(() => '[]');
    const allRooms: Room[] = JSON.parse(allRoomsData);


    const leaseContractsData = await fs.readFile(
      path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json'), 'utf-8'
    ).catch(() => '[]');
    const allLeaseContracts: LeaseContract[] = JSON.parse(leaseContractsData);
    
    // KPI: Vacant Units & Rooms
    const activeContracts = contracts.filter(c => c.status === 'New' || c.status === 'Renew');
    const occupiedUnitCodes = new Set(activeContracts.filter(c => !c.roomCode).map(c => c.unitCode));
    const occupiedRoomCodes = new Set(activeContracts.filter(c => c.roomCode).map(c => c.roomCode));

    const vacantUnitsCount = allUnits.filter(unit => 
        unit.unitStatus === 'Active' && !occupiedUnitCodes.has(unit.unitCode) && allRooms.every(r => r.unitCode !== unit.unitCode)
    ).length;
    
    const vacantRoomsCount = allRooms.filter(room => !occupiedRoomCodes.has(room.roomCode)).length;

    const totalUnits = allUnits.length;
    const totalRooms = allRooms.length;
    
    // KPI: Tenancy Contracts Expiring
    const today = new Date();
    const expiringSoonCount = contracts.filter(contract => {
        const daysRemaining = differenceInDays(parseISO(contract.endDate), today);
        return daysRemaining >= 0 && daysRemaining <= 30;
    }).length;

    // KPI: Lease Contracts Expiring
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
    const dashboardData = await getDashboardData();
    const expiringContracts = await getExpiryReport();
    const bankAccounts = await getBankAccounts();
    const movementHistory = await getMovementHistory();

    return (
        <DashboardClient
            initialDashboardData={dashboardData}
            initialExpiringContracts={expiringContracts}
            initialBankAccounts={bankAccounts}
            initialMovementHistoryCount={movementHistory.length}
        />
    );
}
