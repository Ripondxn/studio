
'use client';

import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type Tab = {
  path: string;
  name: string;
};

// A mapping from URL segments to more readable names
const breadcrumbNameMap: { [key: string]: string } = {
  admin: 'Admin',
  'user-roles': 'User Roles',
  profile: 'Profile',
  property: 'Property',
  properties: 'Properties',
  list: 'List',
  units: 'Units',
  floors: 'Floors',
  rooms: 'Rooms',
  partitions: 'Partitions',
  vacant: 'Vacant Units',
  finance: 'Finance',
  'chart-of-accounts': 'Chart of Accounts',
  'intelligent-pricing': 'Intelligent Pricing',
  workflow: 'Workflow',
  dashboard: 'Dashboard',
  tenancy: 'Tenancy',
  contract: 'New Contract',
  contracts: 'Contracts',
  tenants: 'Tenants',
  landlord: 'Landlord',
  vendors: 'Vendors',
  add: 'Add',
  lease: 'Lease',
  communication: 'Communication',
  'cheque-deposit': 'Cheque Deposit',
  'pdc-cheque': 'PDC Cheque',
  'cheque-print': 'Cheque Print',
  '': 'Dashboard', // For the root path
};

const getTabName = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return 'Dashboard';
  
  const lastSegment = segments[segments.length - 1];

  // If last segment is a query param-like value, use the segment before it
  if (path.includes('?')) {
     const pageNameSegment = segments[segments.length - 1].split('?')[0];
     const name = breadcrumbNameMap[pageNameSegment] || pageNameSegment;
     const code = path.split('=').pop();
     return `${name} (${code})`;
  }

  return breadcrumbNameMap[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
};


export const Breadcrumbs = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [openTabs, setOpenTabs] = useState<Tab[]>([]);

  useEffect(() => {
    const storedTabsRaw = sessionStorage.getItem('openTabs');
    const storedTabs = storedTabsRaw ? JSON.parse(storedTabsRaw) : [];
    
    const currentTabName = getTabName(pathname);

    // Check if the current path is already in the tabs
    const isTabOpen = storedTabs.some((tab: Tab) => tab.path === pathname);

    if (!isTabOpen) {
      const newTabs = [...storedTabs, { path: pathname, name: currentTabName }];
      sessionStorage.setItem('openTabs', JSON.stringify(newTabs));
      setOpenTabs(newTabs);
    } else {
      setOpenTabs(storedTabs);
    }
  }, [pathname]);

  const handleCloseTab = (e: React.MouseEvent, tabToClose: Tab) => {
    e.preventDefault();
    e.stopPropagation();

    const updatedTabs = openTabs.filter(tab => tab.path !== tabToClose.path);
    setOpenTabs(updatedTabs);
    sessionStorage.setItem('openTabs', JSON.stringify(updatedTabs));

    if (pathname === tabToClose.path) {
      const newPath = updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1].path : '/';
      router.push(newPath);
    }
  };


  return (
    <nav aria-label="Breadcrumb" className="flex items-center px-4 md:px-6 h-12 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center space-x-1 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground',
              pathname === '/' ? 'font-semibold text-foreground bg-muted' : ''
            )}
          >
            <Home className="h-4 w-4" />
          </Link>
       
        {openTabs.map((tab) => (
            <Link
                key={tab.path}
                href={tab.path}
                aria-current={pathname === tab.path ? 'page' : undefined}
                className={cn(
                'group flex items-center gap-2 rounded-t-md border-b-2 px-3 py-2 transition-colors hover:border-primary hover:text-foreground',
                pathname === tab.path ? 'font-semibold text-primary border-primary' : 'border-transparent'
                )}
            >
                {tab.name}
                {tab.path !== '/' && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full group-hover:bg-muted"
                        onClick={(e) => handleCloseTab(e, tab)}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Close tab</span>
                    </Button>
                )}
            </Link>
        ))}
      </div>
    </nav>
  );
};
