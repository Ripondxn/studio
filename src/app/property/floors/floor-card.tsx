
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Hash, UserCheck, UserX, Users, FilePlus2 } from 'lucide-react';
import type { Floor } from './schema';
import { EditFloorDialog } from './edit-floor-dialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FloorCardProps {
  floor: Floor;
}

export function FloorCard({ floor }: FloorCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const handleFloorUpdated = () => {
    router.refresh();
  }
  
  const status = floor.occupancyStatus;
  const statusConfig = {
    'Vacant': { variant: 'default', color: 'bg-green-500/20 text-green-700' },
    'Fully Occupied': { variant: 'destructive', color: 'bg-red-500/20 text-red-700' },
    'Partially Occupied': { variant: 'secondary', color: 'bg-yellow-500/20 text-yellow-700' }
  };
  const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', color: '' };
  const Icon = status === 'Vacant' ? UserCheck : status === 'Partially Occupied' ? Users : UserX;

  return (
    <>
      <EditFloorDialog 
        floor={floor} 
        isOpen={isEditDialogOpen} 
        setIsOpen={setIsEditDialogOpen}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardDescription>{floor.floorCode}</CardDescription>
              <CardTitle>{floor.floorName}</CardTitle>
            </div>
            <Badge variant={config.variant as any} className={cn('gap-1', config.color, 'border-transparent')}>
                <Icon className="h-3 w-3" />
                {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><Building className="h-4 w-4" /> Property Code</span>
            <span className="font-medium">{floor.propertyCode}</span>
          </div>
           <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><Hash className="h-4 w-4" /> No. of Units</span>
            <span className="font-semibold font-mono">
              {floor.noOfUnits}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild className="w-full" variant="outline">
            <Link href={`/tenancy/contract?propertyCode=${floor.propertyCode}`}>
               Booking
            </Link>
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
              Edit
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
