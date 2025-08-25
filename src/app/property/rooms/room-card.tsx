
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoorClosed, Hash, Building, Tag, UserX, UserCheck, FilePlus2, Home } from 'lucide-react';
import type { Room } from './schema';
import { EditRoomDialog } from './edit-room-dialog';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  }

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
        onRoomUpdated={handleSuccess}
      />
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-normal">{room.roomCode}</CardTitle>
             <Badge variant={variant} className={cn('gap-1', color, 'border-transparent')}>
                <Icon className="h-3 w-3" />
                {status}
            </Badge>
          </div>
          <CardDescription>{room.roomType}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><Home className="h-4 w-4" /> Unit Code</span>
            <span className="font-medium">{room.unitCode}</span>
          </div>
          {room.rentAmount && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Tag className="h-4 w-4" /> Rent</span>
              <span className="font-semibold font-mono text-base">
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
        <CardFooter className="flex gap-2 mt-auto">
           {room.occupancyStatus === 'Vacant' ? (
              <div className='flex gap-2 w-full'>
                <Button asChild className="flex-1 min-w-0">
                    <Link href={`/tenancy/contract?propertyCode=${room.propertyCode}&unitCode=${room.unitCode}&roomCode=${room.roomCode}`}>
                        Booking
                    </Link>
                </Button>
                <Button variant="outline" className="flex-1 min-w-0" onClick={() => setIsEditDialogOpen(true)}>
                    Edit Room
                </Button>
              </div>
            ) : (
                 <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                    Edit Room
                </Button>
            )}
        </CardFooter>
      </Card>
    </>
  );
}
