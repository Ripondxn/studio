
'use client';

import { RoomCard } from './room-card';
import type { Room } from './schema';
import { DoorClosed } from 'lucide-react';

interface RoomGridProps {
  rooms: Room[];
}

export function RoomGrid({ rooms }: RoomGridProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <DoorClosed className="mx-auto h-12 w-12" />
        <p className="mt-4">No rooms found for this property.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
