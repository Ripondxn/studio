
'use client';

import { LandlordCard } from './landlord-card';
import { type Landlord } from './schema';

interface LandlordGridProps {
  landlords: Landlord[];
}

export function LandlordGrid({ landlords }: LandlordGridProps) {
  if (landlords.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No landlords found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {landlords.map(landlord => (
        <LandlordCard key={landlord.code} landlord={landlord} />
      ))}
    </div>
  );
}
