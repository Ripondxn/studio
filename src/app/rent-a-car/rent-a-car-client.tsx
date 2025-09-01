
'use client';

import { useState, useEffect } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { type Rental } from './schema';
import { Button } from '@/components/ui/button';
import { Plus, Car } from 'lucide-react';
import { AddRentalDialog } from './add-rental-dialog';
import { getAllRentals } from './actions';
import { useCurrency } from '@/context/currency-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function RentACarClient({ initialRentals }: { initialRentals: Rental[] }) {
  const [rentals, setRentals] = useState(initialRentals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | undefined>(undefined);
  const { formatCurrency } = useCurrency();

  const refreshData = async () => {
    const updatedData = await getAllRentals();
    setRentals(updatedData);
  };
  
  useEffect(() => {
    setRentals(initialRentals);
  }, [initialRentals]);

  const handleEdit = (rental: Rental) => {
    setSelectedRental(rental);
    setIsDialogOpen(true);
  };
  
  const summary = rentals.reduce((acc, rental) => {
    if (rental.status === 'Active') {
        if (rental.rentalType === 'Hired') {
            acc.hiredCost += rental.rentalAmount;
        } else {
            acc.rentedRevenue += rental.rentalAmount;
        }
    }
    return acc;
  }, { hiredCost: 0, rentedRevenue: 0 });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Rent-A-Car Management</h1>
          <p className="text-muted-foreground">
            Track all vehicle rentals, both hired and rented out.
          </p>
        </div>
        <Button onClick={() => { setSelectedRental(undefined); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Rental Agreement
        </Button>
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Hired Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{rentals.filter(r => r.rentalType === 'Hired' && r.status === 'Active').length}</div>
                <p className="text-xs text-muted-foreground">Total monthly cost: {formatCurrency(summary.hiredCost)}</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Rented Out Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{rentals.filter(r => r.rentalType === 'Rented' && r.status === 'Active').length}</div>
                <p className="text-xs text-muted-foreground">Total monthly revenue: {formatCurrency(summary.rentedRevenue)}</p>
            </CardContent>
        </Card>
      </div>

      <DataTable columns={columns({ onEdit: handleEdit, onUpdate: refreshData })} data={rentals} />
      <AddRentalDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        rental={selectedRental}
        onSuccess={refreshData}
      />
    </div>
  );
}
