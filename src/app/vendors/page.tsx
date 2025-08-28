
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllVendors } from './actions';
import { VendorContent } from './vendor-content';
import { ImportVendorsDialog } from './import-vendors-dialog';

export default async function VendorsPage() {
  const vendors = await getAllVendors();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Vendors</h1>
        <div className="flex items-center gap-2">
            <ImportVendorsDialog onImportSuccess={() => {}} />
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
