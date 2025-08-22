
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoorClosed, Hash, Building, Tag, UserX, UserCheck, FilePlus2 } from 'lucide-react';
import type { Room } from './schema';
import { EditRoomDialog } from './edit-room-dialog';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const status = room.occupancyStatus;
  const variant = status === 'Occupied' ? 'destructive' : 'default';
  const color = status === 'Vacant' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700';
  const Icon = status === 'Occupied' ? UserX : UserCheck;

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
             <Badge variant={variant} className={cn('gap-1', color, 'border-transparent')}>
                <Icon className="h-3 w-3" />
                {status}
            </Badge>
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
        <CardFooter className="gap-2">
           {room.occupancyStatus === 'Vacant' && (
              <Button asChild className="w-full">
                <Link href={`/tenancy/contract?propertyCode=${room.propertyCode}&unitCode=${room.unitCode}&roomCode=${room.roomCode}`}>
                    <FilePlus2 className="mr-2 h-4 w-4" /> Create Tenancy
                </Link>
              </Button>
            )}
          <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
              Edit Room
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
