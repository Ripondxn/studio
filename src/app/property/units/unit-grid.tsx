'use client';

import { UnitCard } from './unit-card';
import type { Unit } from './schema';

interface UnitGridProps {
  units: Unit[];
}

export function UnitGrid({ units }: UnitGridProps) {
  if (units.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No units found for this property.</p>
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
