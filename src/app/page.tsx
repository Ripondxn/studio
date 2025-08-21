

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
  TrendingDown,
  FileClock,
  Home,
  Plus,
  Mail,
  Receipt,
} from 'lucide-react';
import Link from 'next/link';
import { getAllContracts } from '@/app/tenancy/contract/actions';
import { getUnits } from '@/app/property/units/actions';
import { differenceInDays, parseISO } from 'date-fns';
import { Contract } from '@/app/tenancy/contract/schema';
import { SendRenewalDialogWrapper } from '@/components/send-renewal-dialog-wrapper';
import { Unit } from '@/app/property/units/schema';

const kpiData = [
  {
    title: 'Vacancy Rate',
    value: '12.5%',
    change: '+1.2%',
    changeType: 'increase' as const,
    icon: <Home className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: 'Total Monthly Rent Roll',
    value: '$2,150,000',
    change: '-0.5%',
    changeType: 'decrease' as const,
    icon: <TrendingUp className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: 'Contracts Expiring (30d)',
    value: '42',
    change: '+5',
    changeType: 'increase' as const,
    icon: <FileClock className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: 'Total Vacant Loss',
    value: '$268,750',
    change: '+3.1%',
    changeType: 'increase' as const,
    icon: <TrendingDown className="h-6 w-6 text-muted-foreground" />,
  },
];

type ExpiryReportItem = {
    unit: string;
    tenant: string;
    endDate: string;
    rent: number;
    status: string;
}

async function getExpiryReport(): Promise<ExpiryReportItem[]> {
    const contracts = await getAllContracts();
    const today = new Date();

    const report = contracts
        .map(contract => ({
        ...contract,
        daysRemaining: differenceInDays(parseISO(contract.endDate), today),
        }))
        .filter(contract => contract.daysRemaining >= 0 && contract.daysRemaining <= 90)
        .sort((a, b) => a.daysRemaining - b.daysRemaining)
        .map(contract => ({
            unit: contract.unitCode,
            tenant: contract.tenantName,
            endDate: contract.endDate,
            rent: contract.totalRent,
            status: contract.daysRemaining <= 30 ? 'Renewal Due' : 'Notified'
        }));
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

export default async function Dashboard() {
  const expiryReport = await getExpiryReport();
  const vacantUnits = await getVacantUnits();

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
       <SendRenewalDialogWrapper expiringContracts={expiryReport} />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
            <Button asChild><Link href="/tenancy/contract"><Plus className="mr-2 h-4 w-4"/> Generate New Contract</Link></Button>
            <Button variant="outline"><Receipt className="mr-2 h-4 w-4"/> Record Payment</Button>
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
              <p className={`text-xs ${kpi.changeType === 'increase' ? 'text-destructive' : 'text-emerald-600'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Summary Widgets */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
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
                    {expiryReport.map((item) => (
                        <TableRow key={item.unit}>
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
             <Button asChild variant="link" className="w-full mt-2">
                <Link href="/tenancy/contracts">View All Expiring Contracts</Link>
             </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unit Vacant List</CardTitle>
            <CardDescription>
              Currently available units across all properties.
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
                    {vacantUnits.map((item) => (
                        <TableRow key={item.unitCode}>
                            <TableCell className="font-medium">{item.unitCode}</TableCell>
                            <TableCell>{item.unitType}</TableCell>
                            <TableCell>{item.floor}</TableCell>
                            <TableCell className="text-right">${item.annualRent.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
             <Button asChild variant="link" className="w-full mt-2">
                <Link href="/property/units/vacant">View All Vacant Units</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
