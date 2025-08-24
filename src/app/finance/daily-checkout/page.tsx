

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCheckouts } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddCheckoutDialog } from './add-checkout-dialog';
import { type DailyCheckout } from './schema';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DailyCheckoutPage() {
  const [checkouts, setCheckouts] = useState<DailyCheckout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ email: string, role: UserRole['role'] } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setCurrentUser({ email: profile.email, role: profile.role });
    } else {
      router.push('/login');
    }
  }, [router]);

  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
        const data = await getCheckouts(currentUser);
        setCheckouts(data);
    } catch (e) {
        toast({variant: 'destructive', title: 'Error', description: 'Failed to load checkout data.'});
    } finally {
        setIsLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
      if(currentUser) {
          refreshData();
      }
  }, [currentUser, refreshData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshData]);


  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Daily Checkout Vouchers</h1>
            <p className="text-muted-foreground">
                Group and submit your daily transactions for approval.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <AddCheckoutDialog onCheckoutCreated={refreshData} />
            <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
        </div>
      </div>
      <DataTable columns={columns} data={checkouts} isLoading={isLoading} />
    </div>
  );
}


