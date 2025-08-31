
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { VendorContent } from './vendor-content';
import { ImportVendorsDialog } from './import-vendors-dialog';
import { getAllVendors } from './actions';
import { type Vendor } from './schema';

export function VendorsClient({ initialVendors }: { initialVendors: Vendor[] }) {
  const [vendors, setVendors] = useState(initialVendors);

  const handleImportSuccess = async () => {
    const updatedVendors = await getAllVendors();
    setVendors(updatedVendors);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Vendors</h1>
            <p className="text-muted-foreground">Manage your list of suppliers and service providers.</p>
        </div>
        <div className="flex items-center gap-2">
            <ImportVendorsDialog onImportSuccess={handleImportSuccess} />
            <Button asChild>
            <Link href="/vendors/add">
                <Plus className="mr-2 h-4 w-4" /> Add New Vendor
            </Link>
            </Button>
        </div>
      </div>
      <VendorContent vendors={vendors} />
    </div>
  );
}
