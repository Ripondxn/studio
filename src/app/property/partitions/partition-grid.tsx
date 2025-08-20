
'use client';

import { PartitionCard } from './partition-card';
import type { Partition } from './schema';

interface PartitionGridProps {
  partitions: Partition[];
}

export function PartitionGrid({ partitions }: PartitionGridProps) {
  if (partitions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No partitions found for this property.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {partitions.map(partition => (
        <PartitionCard key={partition.id} partition={partition} />
      ))}
    </div>
  );
}
