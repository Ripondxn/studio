
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, DoorOpen, Home, Tag } from 'lucide-react';
import type { Partition } from './schema';
import { EditPartitionDialog } from './edit-partition-dialog';
import { useState } from 'react';

interface PartitionCardProps {
  partition: Partition;
}

export function PartitionCard({ partition }: PartitionCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
            <Badge variant={partition.status === 'Active' ? 'default' : 'secondary'} className={partition.status === 'Active' ? 'bg-green-500/20 text-green-700' : ''}>
              {partition.status}
            </Badge>
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
