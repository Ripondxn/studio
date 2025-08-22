'use client';

import { VendorCard } from './vendor-card';
import { type Vendor } from './schema';

interface VendorGridProps {
  vendors: Vendor[];
}

export function VendorGrid({ vendors }: VendorGridProps) {
  if (vendors.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No vendors found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {vendors.map(vendor => (
        <VendorCard key={vendor.code} vendor={vendor} />
      ))}
    </div>
  );
}
