
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
  TrendingUp,
  AlertTriangle,
  Hourglass,
  Banknote,
  Receipt,
  UserSquare,
  Package,
  LineChart as FinanceIcon,
  Shuffle,
  DoorOpen,
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
import { ReportCenterWidget } from './reports/report-center-widget';
import { useAuthorization } from '@/context/permission-context';
import { type ModuleSettings } from './admin/access-control/schema';


type DashboardClientProps = {
    initialDashboardData: any;
    initialExpiringContracts: Contract[];
    initialBankAccounts: BankAccount[];
    initialMovementHistoryCount: number;
};


const workflowSteps = [
    {
        category: 'Landlord Onboarding',
        items: [
            { title: 'Landlord', href: '/landlord', icon: <Users className="h-5 w-5" /> },
            { title: 'Properties', href: '/property/properties/list', icon: <Home className="h-5 w-5" /> },
            { title: 'Lease Contracts', href: '/lease/contracts', icon: <FileSignature className="h-5 w-5" /> },
        ]
    },
    {
        category: 'Tenant Management',
        items: [
            { title: 'Tenants', href: '/tenancy/tenants', icon: <Users className="h-5 w-5" /> },
            { title: 'Tenancy Contracts', href: '/tenancy/contracts', icon: <FileSignature className="h-5 w-5" /> },
        ]
    },
     {
        category: 'Customer Billing',
        items: [
            { title: 'Customers', href: '/tenancy/customer', icon: <Users className="h-5 w-5" /> },
            { title: 'Products & Services', href: '/products', icon: <Package className="h-5 w-5" /> },
            { title: 'Invoices', href: '/tenancy/customer', icon: <Receipt className="h-5 w-5" /> },
        ]
    },
    {
        category: 'Vendor Management',
        items: [
            { title: 'Vendors / Suppliers', href: '/vendors', icon: <UserSquare className="h-5 w-5" /> },
            { title: 'Products & Services', href: '/products', icon: <Package className="h-5 w-5" /> },
            { title: 'Bills', href: '/vendors', icon: <FileText className="h-5 w-5" /> },
        ]
    },
    {
        category: 'Daily Finance Operations',
        items: [
            { title: 'Receipt Vouchers', href: '/finance/receipt-vouchers', icon: <Receipt className="h-5 w-5" /> },
            { title: 'Payment Vouchers', href: '/finance/payment', icon: <Banknote className="h-5 w-5" /> },
            { title: 'Cheque Management', href: '/finance/cheque-management', icon: <FileText className="h-5 w-5" /> },
            { title: 'Daily Checkout', href: '/finance/daily-checkout', icon: <CheckCircle className="h-5 w-5" /> },
        ]
    },
];

interface WorkflowDiagramProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    steps: {
        category: string;
        items: {
            title: string;
            href: string;
            icon: React.ReactNode;
        }[];
    }[];
}

const WorkflowDiagram = ({ title, description, icon, steps }: WorkflowDiagramProps) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                {icon}
                {title}
            </CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {steps.map((step, stepIndex) => (
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
                    {stepIndex < steps.length - 1 && <Separator className="my-6" />}
                </div>
            ))}
        </CardContent>
    </Card>
);


export function DashboardClient({ initialDashboardData, initialExpiringContracts, initialBankAccounts, initialMovementHistoryCount }: DashboardClientProps) {
  const { formatCurrency } = useCurrency();
  const { isModuleEnabled } = useAuthorization();

  if (!initialDashboardData) {
    return <div>Loading...</div>;
  }
  
  const {
    vacantUnitsCount,
    totalUnits,
    vacantRoomsCount,
    totalRooms,
    expiringSoonCount,
    leaseExpiringSoonCount,
    totalTenants,
    totalProperties,
  } = initialDashboardData;
  
  const totalBalance = initialBankAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const allKPIs = [
    { module: 'lease', title: 'Total Properties', value: totalProperties, change: 'buildings and lands', icon: <Home className="h-6 w-6 text-muted-foreground" />, href: '/property/properties/list' },
    { module: 'tenant', title: 'Total Tenants', value: totalTenants, change: 'currently active tenants', icon: <Users className="h-6 w-6 text-muted-foreground" />, href: '/tenancy/tenants' },
    { module: 'lease', title: 'Vacant Units', value: `${vacantUnitsCount} / ${totalUnits}`, change: 'View all vacant units', icon: <Home className="h-6 w-6 text-muted-foreground" />, href: '/property/units/vacant' },
    { module: 'lease', title: 'Vacant Rooms', value: `${vacantRoomsCount} / ${totalRooms}`, change: 'View all vacant rooms', icon: <DoorOpen className="h-6 w-6 text-muted-foreground" />, href: '/property/rooms/list' },
    { module: 'tenant', title: 'Tenancy Expiring (30d)', value: expiringSoonCount, change: 'View tenancy contracts', icon: <FileClock className="h-6 w-6 text-muted-foreground" />, href: '/tenancy/contracts' },
    { module: 'lease', title: 'Lease Expiring (30d)', value: leaseExpiringSoonCount, change: 'View lease contracts', icon: <FileClock className="h-6 w-6 text-muted-foreground" />, href: '/lease/contracts' },
    { module: 'workflow', title: 'Tenant Movements', value: initialMovementHistoryCount, change: 'Total recorded relocations', icon: <Shuffle className="h-6 w-6 text-muted-foreground" />, href: '/admin/contract-continuity' }
  ];

  const visibleKpis = allKPIs.filter(kpi => isModuleEnabled(kpi.module));
  
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
         <div className="flex items-center space-x-2">
            <Button asChild>
                <Link href="/reports">View All Reports</Link>
            </Button>
            <SendRenewalDialogWrapper expiringContracts={initialExpiringContracts.map(c => ({ unit: c.unitCode, tenant: c.tenantName, endDate: c.endDate }))} />
        </div>
      </div>
      
      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {visibleKpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs text-muted-foreground`}>
                <Link href={kpi.href} className='hover:underline'>
                  {kpi.change}
                </Link>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2">
               <WorkflowDiagram 
                title="Business Workflow"
                description="A visual guide to your property management and finance process."
                icon={<Route className="h-5 w-5 text-blue-500" />}
                steps={workflowSteps}
               />
           </div>
           <div className="flex flex-col gap-6">
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
            <ReportCenterWidget />
           </div>
        </div>
    </div>
  );
}
