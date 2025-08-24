
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBankAccounts } from './actions';
import { BankingClient } from './banking-client';
import { type BankAccount } from './schema';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { Loader2 } from 'lucide-react';

export default function BankingPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
      const profile: { role: UserRole['role'] } = JSON.parse(storedProfile);
      if (profile.role === 'Admin' || profile.role === 'Super Admin') {
        setIsAuthorized(true);
        getBankAccounts().then(data => {
          setAccounts(data);
          setIsLoading(false);
        });
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
       <div className="flex h-full w-full items-center justify-center p-10">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading Bank Accounts...</span>
        </div>
      </div>
    )
  }

  return (
    <BankingClient initialAccounts={accounts} />
  );
}
