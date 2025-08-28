
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
  FileClock,
  Home,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Landmark,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Contract } from '@/app/tenancy/contract/schema';
import { Unit } from '@/app/property/units/schema';
import { SendRenewalDialogWrapper } from '@/components/send-renewal-dialog-wrapper';
import { type Cheque } from '@/app/finance/cheque-deposit/schema';
import { useCurrency } from '@/context/currency-context';
import { type BankAccount } from '@/app/finance/banking/schema';
import { Separator } from '@/components/ui/separator';


type DashboardClientProps = {
    initialDashboardData: any;
    initialExpiringContracts: Contract[];
    initialBankAccounts: BankAccount[];
};

export function DashboardClient({ initialDashboardData, initialExpiringContracts, initialBankAccounts }: DashboardClientProps) {
  const [landlordPaymentsPage, setLandlordPaymentsPage] = useState(1);
  const { formatCurrency } = useCurrency();

  const landlordPaymentsItemsPerPage = 5;

  if (!initialDashboardData) {
    return <div>Loading...</div>;
  }
  
  const {
    vacantUnitsCount,
    totalUnits,
    expiringSoonCount,
    leaseExpiringSoonCount,
    totalTenants,
    totalProperties,
    upcomingLandlordPayments,
  } = initialDashboardData;
  
  const totalBalance = initialBankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  // Pagination for upcoming landlord payments
  const landlordPaymentsTotalPages = Math.ceil(upcomingLandlordPayments.length / landlordPaymentsItemsPerPage);
  const paginatedLandlordPayments = upcomingLandlordPayments.slice(
    (landlordPaymentsPage - 1) * landlordPaymentsItemsPerPage,
    landlordPaymentsPage * landlordPaymentsItemsPerPage
  );

  const kpiData = [
     {
      title: 'Total Properties',
      value: totalProperties,
      change: 'buildings and lands',
      icon: <Home className="h-6 w-6 text-muted-foreground" />,
      href: '/property/properties/list',
    },
    {
      title: 'Total Tenants',
      value: totalTenants,
      change: 'currently active tenants',
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      href: '/tenancy/tenants',
    },
    {
      title: 'Vacant Units',
      value: `${vacantUnitsCount} / ${totalUnits}`,
      change: 'View all vacant units',
      icon: <Home className="h-6 w-6 text-muted-foreground" />,
      href: '/property/units/vacant',
    },
    {
      title: 'Tenancy Expiring (30d)',
      value: expiringSoonCount,
      change: 'View tenancy contracts',
      icon: <FileClock className="h-6 w-6 text-muted-foreground" />,
      href: '/tenancy/contracts',
    },
     {
      title: 'Lease Expiring (30d)',
      value: leaseExpiringSoonCount,
      change: 'View lease contracts',
      icon: <FileClock className="h-6 w-6 text-muted-foreground" />,
      href: '/lease/contracts',
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
         <div className="flex items-center space-x-2">
            <Button>View All Reports</Button>
            <SendRenewalDialogWrapper expiringContracts={initialExpiringContracts.map(c => ({ unit: c.unitCode, tenant: c.tenantName, endDate: c.endDate }))} />
        </div>
      </div>
      
      {/* Key Metrics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowUp className="h-5 w-5 text-red-500" />
                        Upcoming Payments to Landlords
                    </CardTitle>
                    <CardDescription>
                        A list of upcoming post-dated cheques to be paid out.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Landlord</TableHead>
                                <TableHead>Cheque No.</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedLandlordPayments.map((cheque: Cheque) => (
                                <TableRow key={cheque.id}>
                                    <TableCell>{cheque.partyName}</TableCell>
                                    <TableCell>{cheque.chequeNo}</TableCell>
                                    <TableCell>{format(parseISO(cheque.chequeDate), 'PP')}</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(cheque.amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter className="flex justify-end items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLandlordPaymentsPage(prev => Math.max(prev - 1, 1))}
                        disabled={landlordPaymentsPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {landlordPaymentsPage} of {landlordPaymentsTotalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLandlordPaymentsPage(prev => Math.min(prev + 1, landlordPaymentsTotalPages))}
                        disabled={landlordPaymentsPage === landlordPaymentsTotalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
           </div>
           <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Balances</CardTitle>
                <CardDescription>
                  Your current cash & bank positions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-4">
                    {initialBankAccounts.map(account => (
                      <li key={account.id} className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2">
                           {account.id === 'acc_3' ? <Wallet className="h-4 w-4 text-muted-foreground" /> : <Landmark className="h-4 w-4 text-muted-foreground" />}
                           {account.accountName}
                        </span>
                        <span className="font-mono font-medium">{formatCurrency(account.balance)}</span>
                      </li>
                    ))}
                 </ul>
                 <Separator className="my-4" />
                  <div className="flex justify-between font-bold">
                    <span>Total Balance</span>
                    <span>{formatCurrency(totalBalance)}</span>
                  </div>
              </CardContent>
            </Card>
           </div>
        </div>
    </div>
  );
}
