
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
import { Button } from '@/components/ui/button';
import {
  FileClock,
  Home,
  Users,
  Route,
  CheckCircle,
  Clock,
  ArrowRight,
  FileSignature,
  Shuffle,
  DoorOpen,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Contract } from '@/app/tenancy/contract/schema';
import { SendRenewalDialogWrapper } from '@/components/send-renewal-dialog-wrapper';
import { useCurrency } from '@/context/currency-context';
import { type BankAccount } from '@/app/finance/banking/schema';
import { ReportCenterWidget } from './reports/report-center-widget';
import { useAuthorization } from '@/context/permission-context';
import { type ModuleSettings } from './admin/access-control/schema';


type DashboardClientProps = {
    initialDashboardData: any;
    initialExpiringContracts: Contract[];
    initialBankAccounts: BankAccount[];
    initialMovementHistoryCount: number;
};

const WorkflowDiagram = () => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-blue-500" />
                Business Workflow
            </CardTitle>
            <CardDescription>
                A visual guide to your property management and finance process.
            </CardDescription>
        </CardHeader>
        {/* The actual diagram content would go here */}
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

  const getVisibleKPIs = () => {
    const allKPIs = [
      { id: 'lease', title: 'Total Properties', value: totalProperties, change: 'buildings and lands', icon: <Home className="h-6 w-6 text-muted-foreground" />, href: '/property/properties/list' },
      { id: 'tenant', title: 'Total Tenants', value: totalTenants, change: 'currently active tenants', icon: <Users className="h-6 w-6 text-muted-foreground" />, href: '/tenancy/tenants' },
      { id: 'lease', title: 'Vacant Units', value: `${vacantUnitsCount} / ${totalUnits}`, change: 'View all vacant units', icon: <Home className="h-6 w-6 text-muted-foreground" />, href: '/property/units/vacant' },
      { id: 'lease', title: 'Vacant Rooms', value: `${vacantRoomsCount} / ${totalRooms}`, change: 'View all vacant rooms', icon: <DoorOpen className="h-6 w-6 text-muted-foreground" />, href: '/property/rooms/list' },
      { id: 'tenant', title: 'Tenancy Expiring (30d)', value: expiringSoonCount, change: 'View tenancy contracts', icon: <FileClock className="h-6 w-6 text-muted-foreground" />, href: '/tenancy/contracts' },
      { id: 'lease', title: 'Lease Expiring (30d)', value: leaseExpiringSoonCount, change: 'View lease contracts', icon: <FileClock className="h-6 w-6 text-muted-foreground" />, href: '/lease/contracts' },
      { id: 'workflow', title: 'Tenant Movements', value: initialMovementHistoryCount, change: 'Total recorded relocations', icon: <Shuffle className="h-6 w-6 text-muted-foreground" />, href: '/admin/contract-continuity' },
      { id: 'vault', title: 'Vault', value: 'Securely store and manage your credentials', change: 'Go to Vault', icon: <Lock className="h-6 w-6 text-muted-foreground" />, href: '/vault' }
    ];

    return allKPIs.filter(kpi => isModuleEnabled(kpi.id));
  };
  
  const visibleKpis = getVisibleKPIs();
  
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
               <WorkflowDiagram />
           </div>
           <div className="flex flex-col gap-6">
            <ReportCenterWidget />
           </div>
        </div>
    </div>
  );
}
