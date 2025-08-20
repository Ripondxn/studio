
'use client';

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
import { differenceInDays, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { Contract } from '@/app/tenancy/contract/schema';
import { SendRenewalDialog } from '@/components/send-renewal-dialog';

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

const vacantUnits = [
    { unit: 'D-401', type: '2-Bed', daysVacant: 45, marketRent: 6800 },
    { unit: 'B-115', type: 'Studio', daysVacant: 21, marketRent: 3200 },
    { unit: 'C-208', type: '1-Bed', daysVacant: 14, marketRent: 4500 },
    { unit: 'E-501', type: 'Penthouse', daysVacant: 68, marketRent: 12500 },
];

type ExpiryReportItem = {
    unit: string;
    tenant: string;
    endDate: string;
    rent: number;
    status: string;
}

export default function Dashboard() {
  const [expiryReport, setExpiryReport] = useState<ExpiryReportItem[]>([]);
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchContracts() {
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
        setExpiryReport(report);
    }
    fetchContracts();
  }, [])


  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
       <SendRenewalDialog 
        isOpen={isRenewalDialogOpen}
        setIsOpen={setIsRenewalDialogOpen}
        expiringContracts={expiryReport}
       />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
            <Button asChild><Link href="/tenancy/contract"><Plus className="mr-2 h-4 w-4"/> Generate New Contract</Link></Button>
            <Button variant="outline" onClick={() => setIsRenewalDialogOpen(true)}><Mail className="mr-2 h-4 w-4"/> Send Renewal Email</Button>
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
             <Button variant="link" className="w-full mt-2">View All Expiring Contracts</Button>
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
                        <TableHead>Days Vacant</TableHead>
                        <TableHead className="text-right">Market Rent</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vacantUnits.map((item) => (
                        <TableRow key={item.unit}>
                            <TableCell className="font-medium">{item.unit}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.daysVacant}</TableCell>
                            <TableCell className="text-right">${item.marketRent.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
             <Button variant="link" className="w-full mt-2">View All Vacant Units</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
