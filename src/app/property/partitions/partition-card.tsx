
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, DoorOpen, Home, Tag, UserCheck, UserX } from 'lucide-react';
import type { Partition } from './schema';
import { EditPartitionDialog } from './edit-partition-dialog';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PartitionCardProps {
  partition: Partition;
}

export function PartitionCard({ partition }: PartitionCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const occupancyStatus = partition.occupancyStatus;
  const occupancyVariant = occupancyStatus === 'Occupied' ? 'destructive' : 'default';
  const occupancyColor = occupancyStatus === 'Vacant' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700';
  const OccupancyIcon = occupancyStatus === 'Occupied' ? UserX : UserCheck;

  return (
    <>
      <EditPartitionDialog 
        partition={partition} 
        isOpen={isEditDialogOpen} 
        setIsOpen={setIsEditDialogOpen}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardDescription>{partition.partitionCode}</CardDescription>
              <CardTitle>{partition.partitionName}</CardTitle>
            </div>
             <div className="flex flex-col items-end gap-1">
                <Badge variant={partition.status === 'Active' ? 'default' : 'secondary'} className={partition.status === 'Active' ? 'bg-green-500/20 text-green-700' : ''}>
                {partition.status}
                </Badge>
                 <Badge variant={occupancyVariant} className={cn('gap-1', occupancyColor, 'border-transparent')}>
                    <OccupancyIcon className="h-3 w-3" />
                    {occupancyStatus}
                </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
           <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><Building className="h-4 w-4" /> Floor</span>
            <span className="font-medium">{partition.floorCode}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><Home className="h-4 w-4" /> Unit</span>
            <span className="font-medium">{partition.unitCode}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><DoorOpen className="h-4 w-4" /> Room</span>
            <span className="font-medium">{partition.roomCode || 'N/A'}</span>
          </div>
           <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><Tag className="h-4 w-4" /> Monthly Rent</span>
            <span className="font-semibold font-mono">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(partition.monthlyRent)}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
              Edit Partition
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
