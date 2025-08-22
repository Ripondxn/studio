

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TrendingUp,
  FileClock,
  Home,
  AlertTriangle,
  Users,
  Building,
} from 'lucide-react';
import Link from 'next/link';
import { getAllContracts } from '@/app/tenancy/contract/actions';
import { getUnits } from '@/app/property/units/actions';
import { getSummary as getPdcChequeSummary } from '@/app/finance/cheque-deposit/actions';
import { differenceInDays, parseISO, subMonths, format } from 'date-fns';
import { Contract } from '@/app/tenancy/contract/schema';
import { Unit } from '@/app/property/units/schema';
import { promises as fs } from 'fs';
import path from 'path';
import { DashboardChart } from '@/components/dashboard-chart';
import { getAllTenants } from '@/app/tenancy/tenants/actions';

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

    // Chart: Monthly Rent Roll
    const sixMonthsAgo = subMonths(today, 5);
    const monthlyRentRollData = Array.from({ length: 6 }).map((_, i) => {
        const monthDate = subMonths(today, i);
        return {
            month: format(monthDate, 'MMM'),
            totalRent: 0,
        };
    }).reverse();

    contracts.forEach(contract => {
        if (contract.status === 'New' || contract.status === 'Renew') {
            const contractStart = parseISO(contract.startDate);
            monthlyRentRollData.forEach(monthData => {
                const monthDate = new Date(`${monthData.month} 1, ${today.getFullYear()}`);
                if(contractStart <= monthDate) {
                    monthData.totalRent += (contract.totalRent / 12); // Simplified for monthly roll
                }
            })
        }
    });

    return {
        vacantUnitsCount,
        totalUnits,
        expiringSoonCount,
        chequeSummary,
        totalTenants: tenants.length,
        totalProperties: allProperties.length,
        monthlyRentRollData,
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
    monthlyRentRollData
  } = await getDashboardData();
  
  const occupancyData = [
      { status: 'Occupied', value: totalUnits - vacantUnitsCount, fill: 'hsl(var(--primary))' },
      { status: 'Vacant', value: vacantUnitsCount, fill: 'hsl(var(--muted))' }
  ]

  const kpiData = [
    {
      title: 'Total Properties',
      value: totalProperties,
      change: 'All managed properties',
      icon: <Building className="h-6 w-6 text-muted-foreground" />,
      href: '/property/properties/list',
    },
    {
      title: 'Total Tenants',
      value: totalTenants,
      change: 'All active tenants',
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      href: '/tenancy/tenants',
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
                {kpi.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Summary Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>Unit Occupancy Overview</CardTitle>
                 <CardDescription>
                  A visual breakdown of occupied vs. vacant units.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DashboardChart data={occupancyData} type="pie" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Monthly Rent Roll</CardTitle>
                <CardDescription>
                  Estimated rental income over the last 6 months.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DashboardChart data={monthlyRentRollData} type="bar" />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

