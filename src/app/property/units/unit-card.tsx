

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BedDouble, Bath, Home, Tag, FilePlus2 } from 'lucide-react';
import type { Unit } from './schema';
import { EditUnitDialog } from './edit-unit-dialog';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UnitCardProps {
  unit: Unit;
}

export function UnitCard({ unit }: UnitCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  }

  return (
    <>
      <EditUnitDialog 
        unit={unit} 
        isOpen={isEditDialogOpen} 
        setIsOpen={setIsEditDialogOpen}
        onUnitUpdated={handleSuccess}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardDescription>{unit.unitType}</CardDescription>
              <CardTitle>{unit.unitCode}</CardTitle>
            </div>
            <Badge variant={unit.occupancyStatus === 'Vacant' ? 'default' : 'destructive'} className={cn(unit.occupancyStatus === 'Vacant' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700', 'border-transparent')}>
              {unit.occupancyStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><Home className="h-4 w-4" /> Floor</span>
            <span className="font-medium">{unit.floor}</span>
          </div>
           <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2"><Tag className="h-4 w-4" /> Annual Rent</span>
            <span className="font-semibold font-mono">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(unit.annualRent)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          {unit.occupancyStatus === 'Vacant' && (
             <Button asChild className="w-full">
                <Link href={`/tenancy/contract?propertyCode=${unit.propertyCode}&unitCode=${unit.unitCode}`}>
                    <FilePlus2 className="mr-2 h-4 w-4" /> Create Tenancy
                </Link>
             </Button>
          )}
          <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
              Edit Unit
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
