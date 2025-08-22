import { promises as fs } from 'fs';
import path from 'path';
import { differenceInDays, parseISO } from 'date-fns';
import { getAllContracts } from '@/app/tenancy/contract/actions';
import { getUnits } from '@/app/property/units/actions';
import { getSummary as getPdcChequeSummary } from '@/app/finance/pdc-cheque/actions';
import { getAllTenants } from '@/app/tenancy/tenants/actions';
import { Contract } from '@/app/tenancy/contract/schema';
import { Unit } from '@/app/property/units/schema';
import { DashboardClient } from './dashboard-client';

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
    const chequeSummary = await getPdcChequeSummary();
    const tenants = await getAllTenants();
    
    const propertiesData = await fs.readFile(
      path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json')
    );
    const allProperties = JSON.parse(propertiesData.toString());

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
    
    // KPI: Contracts Expiring
    const today = new Date();
    const expiringSoonCount = contracts.filter(contract => {
        const daysRemaining = differenceInDays(parseISO(contract.endDate), today);
        return daysRemaining >= 0 && daysRemaining <= 30;
    }).length;

    return {
        vacantUnitsCount,
        totalUnits,
        expiringSoonCount,
        chequeSummary,
        totalTenants: tenants.length,
        totalProperties: allProperties.length,
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