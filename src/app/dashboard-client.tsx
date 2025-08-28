
'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileClock,
  Home,
  Users,
  Route,
  CheckCircle,
  Clock,
  ListTodo,
  Landmark,
  Wallet,
  ArrowRight,
  FileSignature,
  Wrench,
  FileText,
  Building2,
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
import { cn } from '@/lib/utils';


type DashboardClientProps = {
    initialDashboardData: any;
    initialExpiringContracts: Contract[];
    initialBankAccounts: BankAccount[];
};


const workflowSteps = [
    {
        category: 'Setup & Leasing',
        items: [
            { title: 'Properties', href: '/property/properties/list', icon: <Home className="h-5 w-5" /> },
            { title: 'Units', href: '/property/units/list', icon: <Building2 className="h-5 w-5" /> },
            { title: 'Landlords', href: '/landlord', icon: <Users className="h-5 w-5" /> },
            { title: 'Tenants', href: '/tenancy/tenants', icon: <Users className="h-5 w-5" /> },
            { title: 'Lease Contracts', href: '/lease/contracts', icon: <FileSignature className="h-5 w-5" /> },
            { title: 'Tenancy Contracts', href: '/tenancy/contracts', icon: <FileSignature className="h-5 w-5" /> },
        ]
    },
    {
        category: 'Financial Operations',
        items: [
            { title: 'Receive Payments', href: '/finance/payment', icon: <Wallet className="h-5 w-5" /> },
            { title: 'Manage Cheques', href: '/finance/cheque-deposit', icon: <Landmark className="h-5 w-5" /> },
            { title: 'Make Payments', href: '/finance/payment', icon: <Wallet className="h-5 w-5" /> },
        ]
    },
    {
        category: 'Maintenance',
        items: [
            { title: 'Issue Tickets', href: '/maintenance/ticket-issue', icon: <Wrench className="h-5 w-5" /> },
            { title: 'Service Contracts', href: '/maintenance/contracts', icon: <FileText className="h-5 w-5" /> },
        ]
    }
];

const WorkflowDiagram = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-blue-500" />
                Operational Workflow
            </CardTitle>
            <CardDescription>
                A visual guide to your property management process.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {workflowSteps.map((step, stepIndex) => (
                <div key={step.category} className="space-y-3">
                    <h3 className="font-semibold text-muted-foreground">{step.category}</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        {step.items.map((item, itemIndex) => (
                            <React.Fragment key={item.title}>
                                <Button variant="outline" asChild className="h-16 flex-col gap-1 items-center justify-center p-2 text-center text-xs w-24">
                                    <Link href={item.href}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </Button>
                                {itemIndex < step.items.length - 1 && (
                                    <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    {stepIndex < workflowSteps.length - 1 && <Separator className="my-6" />}
                </div>
            ))}
        </CardContent>
    </Card>
);


export function DashboardClient({ initialDashboardData, initialExpiringContracts, initialBankAccounts }: DashboardClientProps) {
  const { formatCurrency } = useCurrency();

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
  } = initialDashboardData;
  
  const totalBalance = initialBankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  
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
               <WorkflowDiagram />
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
