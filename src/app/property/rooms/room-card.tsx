
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoorClosed, Hash, Building, Tag } from 'lucide-react';
import type { Room } from './schema';
import { EditRoomDialog } from './edit-room-dialog';
import { useState } from 'react';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <EditRoomDialog 
        room={room} 
        isOpen={isEditDialogOpen} 
        setIsOpen={setIsEditDialogOpen}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardDescription>{room.roomCode}</CardDescription>
              <CardTitle>{room.roomName}</CardTitle>
            </div>
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <DoorClosed className="h-5 w-5 text-secondary-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><Building className="h-4 w-4" /> Floor</span>
            <span className="font-medium">{room.floorCode}</span>
          </div>
           <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><Hash className="h-4 w-4" /> Room Type</span>
            <span className="font-semibold font-mono">
              {room.roomType}
            </span>
          </div>
          {room.rentAmount && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Tag className="h-4 w-4" /> Rent</span>
              <span className="font-semibold font-mono">
                 {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(room.rentAmount)}
                <span className="text-xs text-muted-foreground font-sans normal-case">/{room.rentFrequency?.slice(0,2)}</span>
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
              Edit Room
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
