
'use client';

import { useState, useEffect } from 'react';
import { getReceiptVouchers } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ReceiptVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getReceiptVouchers().then(data => {
      setVouchers(data);
      setIsLoading(false);
    });
  }, []);
  
  return (
    <div className="container mx-auto py-10">
       <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Receipt Vouchers</h1>
            <p className="text-muted-foreground">
                Create and manage all payment receipt vouchers.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/finance/receipt-vouchers/add-single">
                    <Plus className="mr-2 h-4 w-4" /> Create Single Voucher
                </Link>
            </Button>
             <Button asChild variant="outline">
                <Link href="/finance/receipt-vouchers/add">
                    <Plus className="mr-2 h-4 w-4" /> Create Batch Voucher
                </Link>
            </Button>
        </div>
      </div>
      <DataTable columns={columns} data={vouchers} />
    </div>
  )
}
