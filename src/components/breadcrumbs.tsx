
'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

// A mapping from URL segments to more readable names
const breadcrumbNameMap: { [key: string]: string } = {
  admin: 'Admin',
  'user-roles': 'User Roles',
  profile: 'Profile',
  property: 'Property',
  properties: 'Properties',
  list: 'List',
  unit: 'Unit',
  units: 'Units',
  finance: 'Finance',
  'chart-of-accounts': 'Chart of Accounts',
  'intelligent-pricing': 'Intelligent Pricing',
  workflow: 'Workflow'
};

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center px-4 md:px-6 h-12">
      <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
        <li>
          <div className="flex items-center">
            <Link href="/" className="hover:text-foreground">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;
          const name = breadcrumbNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

          // Don't show a breadcrumb for query param pages like [code]
          if (segment.startsWith('[') && segment.endsWith(']')) {
            return null;
          }
          
           // Hide the 'list' segment as it's often redundant
          if (segment.toLowerCase() === 'list') {
            return null;
          }

          return (
            <Fragment key={href}>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4" />
                  <Link
                    href={href}
                    aria-current={isLast ? 'page' : undefined}
                    className={cn(
                      'ml-1 rounded-md px-2 py-1 transition-colors hover:bg-muted hover:text-foreground',
                      isLast ? 'font-semibold text-foreground' : ''
                    )}
                  >
                    {name}
                  </Link>
                </div>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
