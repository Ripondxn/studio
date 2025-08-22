

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
  Plus,
  Receipt,
  AlertTriangle,
  Users,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { getAllContracts } from '@/app/tenancy/contract/actions';
import { getUnits } from '@/app/property/units/actions';
import { getSummary as getPdcChequeSummary } from '@/app/finance/cheque-deposit/actions';
import { differenceInDays, parseISO, differenceInMonths } from 'date-fns';
import { Contract } from '@/app/tenancy/contract/schema';
import { SendRenewalDialogWrapper } from '@/components/send-renewal-dialog-wrapper';
import { Unit } from '@/app/property/units/schema';

type ExpiryReportItem = {
    unit: string;
    tenant: string;
    endDate: string;
    rent: number;
    status: string;
    contractNo: string;
}

async function getExpiryReport(): Promise<ExpiryReportItem[]> {
    const contracts = await getAllContracts();
    const today = new Date();

    const uniqueContracts = new Map<string, Contract>();

    // Prioritize contracts with the latest end date for each unit
    contracts.forEach(contract => {
        const existing = uniqueContracts.get(contract.unitCode);
        if (!existing || new Date(contract.endDate) > new Date(existing.endDate)) {
            uniqueContracts.set(contract.unitCode, contract);
        }
    });

    const report = Array.from(uniqueContracts.values())
        .map(contract => {
            const daysRemaining = differenceInDays(parseISO(contract.endDate), today);
            return {
                unit: contract.unitCode,
                tenant: contract.tenantName,
                endDate: contract.endDate,
                rent: contract.totalRent,
                status: daysRemaining <= 30 ? 'Renewal Due' : 'Notified',
                contractNo: contract.contractNo,
                daysRemaining,
            };
        })
        .filter(contract => contract.daysRemaining >= 0 && contract.daysRemaining <= 90)
        .sort((a, b) => a.daysRemaining - b.daysRemaining);

    return report;
}

async function getVacantUnits() {
    const allUnits = await getUnits();
    const allContracts = await getAllContracts();

    const activeContractUnitCodes = new Set(
        allContracts
            .filter(c => c.status === 'New' || c.status === 'Renew')
            .map(c => c.unitCode)
    );

    const vacantUnits = allUnits.filter(unit => 
        unit.unitStatus === 'Active' && !activeContractUnitCodes.has(unit.unitCode)
    );

    return vacantUnits;
}

async function getRentRollSummary() {
    const contracts = await getAllContracts();
    const activeContracts = contracts.filter(c => c.status === 'New' || c.status === 'Renew');

    const totalMonthlyRent = activeContracts.reduce((sum, contract) => {
        const startDate = parseISO(contract.startDate);
        const endDate = parseISO(contract.endDate);
        let durationInMonths = differenceInMonths(endDate, startDate);

        // Handle cases where the contract is less than a month long as 1 month
        if (durationInMonths === 0) {
            durationInMonths = 1;
        }

        if (durationInMonths > 0) {
            return sum + (contract.totalRent / durationInMonths);
        }
        
        return sum;
    }, 0);
    
    return {
        monthlyRentRoll: totalMonthlyRent
    };
}


export default async function Dashboard() {
  const expiryReport = await getExpiryReport();
  const vacantUnits = await getVacantUnits();
  const chequeSummary = await getPdcChequeSummary();
  const rentRollSummary = await getRentRollSummary();
  const expiringSoonCount = expiryReport.filter(c => (differenceInDays(parseISO(c.endDate), new Date()) <= 30)).length;

  const kpiData = [
    {
      title: 'Vacant Units',
      value: vacantUnits.length,
      change: '+2 from last month',
      changeType: 'increase' as const,
      icon: <Home className="h-6 w-6 text-muted-foreground" />,
      href: '/property/units/vacant',
    },
    {
      title: 'Total Monthly Rent Roll',
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(rentRollSummary.monthlyRentRoll),
      change: 'from active contracts',
      changeType: 'increase' as const,
      icon: <TrendingUp className="h-6 w-6 text-muted-foreground" />,
      href: '/tenancy/contracts',
    },
    {
      title: 'Contracts Expiring (30d)',
      value: expiringSoonCount,
      change: `${expiryReport.length} total in 90d`,
      changeType: 'increase' as const,
      icon: <FileClock className="h-6 w-6 text-muted-foreground" />,
      href: '/tenancy/contracts',
    },
    {
        title: 'Overdue Cheques',
        value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(chequeSummary.overdueTotal),
        change: `${chequeSummary.overdueCount} cheques`,
        changeType: 'increase' as const,
        icon: <AlertTriangle className="h-6 w-6 text-muted-foreground" />,
        href: '/finance/pdc-cheque',
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
            <Button asChild><Link href="/lease/contract"><Plus className="mr-2 h-4 w-4"/> New Lease</Link></Button>
            <Button asChild><Link href="/tenancy/contract"><Plus className="mr-2 h-4 w-4"/> New Tenancy</Link></Button>
            <SendRenewalDialogWrapper expiringContracts={expiryReport} />
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
            <CardTitle>Contract Expiry Report (Next 90 Days)</CardTitle>
            <CardDescription>
              Contracts approaching their end date.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Unit</TableHead>
                        <TableHead>Tenant</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead className="text-right">Rent</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expiryReport.slice(0, 5).map((item) => (
                        <TableRow key={item.contractNo}>
                            <TableCell className="font-medium">{item.unit}</TableCell>
                            <TableCell>{item.tenant}</TableCell>
                            <TableCell>{item.endDate}</TableCell>
                            <TableCell className="text-right">${item.rent.toLocaleString()}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant={item.status === 'Renewal Due' ? 'destructive' : 'secondary'}>{item.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vacant Units</CardTitle>
            <CardDescription>
              A selection of currently available units.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Unit</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Floor</TableHead>
                        <TableHead className="text-right">Annual Rent</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vacantUnits.slice(0,5).map((item) => (
                        <TableRow key={`${item.propertyCode}-${item.unitCode}`}>
                            <TableCell className="font-medium">{item.unitCode}</TableCell>
                            <TableCell>{item.unitType}</TableCell>
                            <TableCell>{item.floor}</TableCell>
                            <TableCell className="text-right">${item.annualRent.toLocaleString()}</TableCell>
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
