

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccounts } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { FileDown, Plus, Loader2 } from 'lucide-react';
import { AddAccountDialog } from './add-account-dialog';
import type { Account } from './schema';
import type { UserRole } from '@/app/admin/user-roles/schema';


export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
      const profile: { role: UserRole['role'] } = JSON.parse(storedProfile);
      if (profile.role === 'Admin' || profile.role === 'Super Admin' || profile.role === 'Accountant') {
        setIsAuthorized(true);
        getAccounts().then(data => {
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
          <span>Loading Chart of Accounts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Chart of Accounts</h1>
            <p className="text-muted-foreground">
                Manage your financial accounts and their structure.
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" /> Import
            </Button>
            <AddAccountDialog />
        </div>
      </div>
      <DataTable columns={columns} data={accounts} />
    </div>
  );
}
