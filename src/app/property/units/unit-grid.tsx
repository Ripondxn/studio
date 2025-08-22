'use client';

import { UnitCard } from './unit-card';
import type { Unit } from './schema';
import { Home } from 'lucide-react';

interface UnitGridProps {
  units: Unit[];
}

export function UnitGrid({ units }: UnitGridProps) {
  if (units.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Home className="mx-auto h-12 w-12" />
        <p className="mt-4">No units found for this property.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {units.map(unit => (
        <UnitCard key={`${unit.id}-${unit.unitCode}`} unit={unit} />
      ))}
    </div>
  );
}
