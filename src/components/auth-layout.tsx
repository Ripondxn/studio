'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { checkLicenseStatus, type LicenseStatus } from '@/lib/license';
import { TrialExpiredPage } from '@/components/trial-expired-page';
import { Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [licenseStatus, setLicenseStatus] = React.useState<LicenseStatus | null>(null);

  React.useEffect(() => {
    async function getLicenseStatus() {
        const status = await checkLicenseStatus();
        setLicenseStatus(status);
    }
    if (user) {
        getLicenseStatus();
    }
  }, [user]);
  
  if (!user && pathname !== '/login' && !pathname.startsWith('/pay')) {
      if (typeof window !== 'undefined') {
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser) {
            return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
        }
      }
  }
  
  if (pathname === '/login' || pathname.startsWith('/pay')) {
      return <>{children}</>;
  }
  
  if (!licenseStatus && user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  if (licenseStatus && !licenseStatus.isActive) {
    return <TrialExpiredPage daysRemaining={licenseStatus.daysRemaining} expiryDate={licenseStatus.expiryDate} />;
  }
  
  const userProfile = user || (typeof window !== 'undefined' && JSON.parse(sessionStorage.getItem('user') || '{}'));
  
  if (!userProfile.email) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return <AppLayout>{children}</AppLayout>;
}
