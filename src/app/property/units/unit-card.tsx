
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BedDouble, Bath, Home, Tag } from 'lucide-react';
import type { Unit } from './schema';
import { EditUnitDialog } from './edit-unit-dialog';
import { useState } from 'react';

interface UnitCardProps {
  unit: Unit;
}

export function UnitCard({ unit }: UnitCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <>
      <EditUnitDialog 
        unit={unit} 
        isOpen={isEditDialogOpen} 
        setIsOpen={setIsEditDialogOpen}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardDescription>{unit.unitType}</CardDescription>
              <CardTitle>{unit.unitCode}</CardTitle>
            </div>
            <Badge variant={unit.unitStatus === 'Active' ? 'default' : 'secondary'} className={unit.unitStatus === 'Active' ? 'bg-green-500/20 text-green-700' : ''}>
              {unit.unitStatus}
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
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
              Edit Unit
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
