
'use client';

import { FloorCard } from './floor-card';
import type { Floor } from './schema';

interface FloorGridProps {
  floors: Floor[];
}

export function FloorGrid({ floors }: FloorGridProps) {
  if (floors.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No floors found for this property.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {floors.map(floor => (
        <FloorCard key={floor.id} floor={floor} />
      ))}
    </div>
  );
}
