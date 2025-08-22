

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  FileClock,
  Home,
  AlertTriangle,
  Users,
  Building,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { getAllContracts } from '@/app/tenancy/contract/actions';
import { getUnits } from '@/app/property/units/actions';
import { getSummary as getPdcChequeSummary } from '@/app/finance/pdc-cheque/actions';
import { differenceInDays, parseISO, subMonths, format } from 'date-fns';
import { Contract } from '@/app/tenancy/contract/schema';
import { Unit } from '@/app/property/units/schema';
import { promises as fs } from 'fs';
import path from 'path';
import { getAllTenants } from '@/app/tenancy/tenants/actions';
import { SendRenewalDialogWrapper } from '@/components/send-renewal-dialog-wrapper';


async function getExpiryReport() {
    const contracts = await getAllContracts();
    const today = new Date();
    
    const expiringSoon = contracts.filter(contract => {
        const daysRemaining = differenceInDays(parseISO(contract.endDate), today);
        return daysRemaining >= 0 && daysRemaining <= 30;
    });

    // Use a Map to ensure unique entries by contractNo
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
    
    // Create unique keys for each vacant unit
    const uniqueVacantUnits = new Map<string, Unit>();
    for (const unit of vacantUnits) {
        const uniqueKey = `${unit.propertyCode}-${unit.unitCode}`;
        if (!uniqueVacantUnits.has(uniqueKey)) {
            uniqueVacantUnits.set(uniqueKey, unit);
        }
    }
    
    return Array.from(uniqueVacantUnits.values());
}

async function getRentRollSummary() {
    const contracts = await getAllContracts();
    const activeContracts = contracts.filter(c => c.status === 'New' || c.status === 'Renew');
    
    const totalMonthlyRent = activeContracts.reduce((total, contract) => {
        const startDate = parseISO(contract.startDate);
        const endDate = parseISO(contract.endDate);
        const durationInMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
        
        if (durationInMonths > 0) {
            return total + (contract.totalRent / durationInMonths);
        }
        return total;
    }, 0);

    return {
        totalMonthlyRent
    };
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
    const rentRollSummary = await getRentRollSummary();


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
        totalMonthlyRent: rentRollSummary.totalMonthlyRent,
    };
}


export default async function Dashboard() {
  const {
    vacantUnitsCount,
    totalUnits,
    expiringSoonCount,
    chequeSummary,
    totalTenants,
    totalProperties,
    totalMonthlyRent,
  } = await getDashboardData();
  
  const expiringContracts = await getExpiryReport();
  const vacantUnits = await getVacantUnits();

  const kpiData = [
     {
      title: 'Total Monthly Rent Roll',
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalMonthlyRent),
      change: `from ${totalUnits - vacantUnitsCount} occupied units`,
      icon: <TrendingUp className="h-6 w-6 text-muted-foreground" />,
      href: '/finance/due-payments',
    },
    {
      title: 'Vacant Units',
      value: `${vacantUnitsCount} / ${totalUnits}`,
      change: 'View all vacant units',
      icon: <Home className="h-6 w-6 text-muted-foreground" />,
      href: '/property/units/vacant',
    },
    {
      title: 'Contracts Expiring (30d)',
      value: expiringSoonCount,
      change: 'View all contracts',
      icon: <FileClock className="h-6 w-6 text-muted-foreground" />,
      href: '/tenancy/contracts',
    },
    {
        title: 'Overdue Cheques',
        value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(chequeSummary.overdueTotal),
        change: `${chequeSummary.overdueCount} cheques`,
        icon: <AlertTriangle className="h-6 w-6 text-muted-foreground" />,
        href: '/finance/pdc-cheque',
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
         <div className="flex items-center space-x-2">
            <Button>View All Reports</Button>
            <SendRenewalDialogWrapper expiringContracts={expiringContracts.map(c => ({ unit: c.unitCode, tenant: c.tenantName, endDate: c.endDate }))} />
        </div>
      </div>
      
      {/* Key Metrics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs text-muted-foreground`}>
                <Link href={kpi.href}>
                  {kpi.change}
                </Link>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
           <Card>
              <CardHeader>
                <CardTitle>Contract Expiry Report (Next 30 Days)</CardTitle>
                <CardDescription>
                  Contracts that are due for renewal soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead className="text-right">Days Remaining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringContracts.map((item) => (
                      <TableRow key={item.contractNo}>
                        <TableCell>{item.unitCode}</TableCell>
                        <TableCell>{item.tenantName}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="destructive">{differenceInDays(parseISO(item.endDate), new Date())} days</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Unit Vacant List</CardTitle>
                <CardDescription>
                  A list of all currently available units.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Annual Rent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vacantUnits.map((item) => (
                      <TableRow key={`${item.propertyCode}-${item.unitCode}`}>
                        <TableCell>{item.propertyCode}</TableCell>
                        <TableCell>{item.unitCode}</TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.annualRent)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        </div>
    </div>
  );
}
