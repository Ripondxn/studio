
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

async function getVacantUnits() {
    const allUnits = await getUnits();
    const vacantUnits = allUnits.filter(unit => unit.occupancyStatus === 'Vacant');
    
    const uniqueVacantUnits = new Map<string, Unit>();
    for (const unit of vacantUnits) {
        const uniqueKey = `${unit.propertyCode}-${unit.unitCode}`;
        if (!uniqueVacantUnits.has(uniqueKey)) {
            uniqueVacantUnits.set(uniqueKey, unit);
        }
    }
    
    return Array.from(uniqueVacantUnits.values());
}

async function getDashboardData() {
    const contracts = await getAllContracts();
    const allUnits = await getUnits();
    const tenants = await getAllTenants();
    
    const propertiesData = await fs.readFile(
      path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json')
    );
    const allProperties = JSON.parse(propertiesData.toString());

    const leaseContractsData = await fs.readFile(
      path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json'), 'utf-8'
    ).catch(() => '[]');
    const allLeaseContracts: LeaseContract[] = JSON.parse(leaseContractsData);

    const landlordsData = await fs.readFile(
      path.join(process.cwd(), 'src/app/landlord/landlords-data.json'), 'utf-8'
    ).catch(() => '[]');
    const allLandlords = JSON.parse(landlordsData);
    
    const landlordMap = new Map(allLandlords.map((l: any) => [l.landlordData.code, l.landlordData.name]));

    // KPI: Vacant Units
    const activeContractUnitCodes = new Set(
        contracts
            .filter(c => c.status === 'New' || c.status === 'Renew')
            .map(c => c.unitCode)
    );
    const vacantUnitsCount = allUnits.filter(unit => 
        unit.unitStatus === 'Active' && !activeContractUnitCodes.has(unit.unitCode)
    ).length;
    const totalUnits = allUnits.length;
    
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

    // Data for Landlord Payments
    const upcomingLandlordPayments = allLeaseContracts
      .filter(c => c.paymentSchedule)
      .flatMap(c => c.paymentSchedule
        .filter(p => p.status !== 'paid' && isFuture(parseISO(p.dueDate)))
        .map(p => ({
          id: `${c.id}-${p.installment}`,
          partyName: landlordMap.get(c.landlordCode) || c.landlordCode,
          chequeNo: p.chequeNo || `INST-${p.installment}`,
          chequeDate: p.dueDate,
          amount: p.amount,
          type: 'Outgoing',
          status: 'In Hand' // Simplified status for dashboard view
        } as Cheque)) // Use Cheque type for structure compatibility
      )
      .sort((a, b) => new Date(a.chequeDate).getTime() - new Date(b.chequeDate).getTime());

    return {
        vacantUnitsCount,
        totalUnits,
        expiringSoonCount,
        leaseExpiringSoonCount,
        totalTenants: tenants.length,
        totalProperties: allProperties.length,
        totalLandlords: allLandlords.length,
        upcomingLandlordPayments,
    };
}


export default async function DashboardPage() {
    const dashboardData = await getDashboardData();
    const expiringContracts = await getExpiryReport();
    const vacantUnits = await getVacantUnits();

    return (
        <DashboardClient
            initialDashboardData={dashboardData}
            initialExpiringContracts={expiringContracts}
            initialVacantUnits={vacantUnits}
        />
    );
}
