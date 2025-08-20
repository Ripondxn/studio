
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Hash } from 'lucide-react';
import type { Floor } from './schema';
import { EditFloorDialog } from './edit-floor-dialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FloorCardProps {
  floor: Floor;
}

export function FloorCard({ floor }: FloorCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const handleFloorUpdated = () => {
    // This is a bit of a hack to force a refresh.
    // In a real app with a state management library, this would be handled more gracefully.
    router.refresh();
  }

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
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
              Edit Floor
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
