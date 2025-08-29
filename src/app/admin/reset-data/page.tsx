
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResetDataClient } from './reset-data-client';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { Loader2 } from 'lucide-react';

export default function ResetDataPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            const profile: { role: UserRole['role'] } = JSON.parse(storedProfile);
            if (profile.role === 'Super Admin') {
                setIsAuthorized(true);
            } else {
                router.push('/');
            }
        } else {
            router.push('/login');
        }
        setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    // Optionally return a more specific "Access Denied" component
    return null;
  }

  return <ResetDataClient />;
}
