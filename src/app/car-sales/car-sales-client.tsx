
'use client';

import { useState, useEffect } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { type Vehicle } from './schema';
import { Button } from '@/components/ui/button';
import { Plus, Car } from 'lucide-react';
import { AddVehicleDialog } from './add-vehicle-dialog';
import { getAllVehicles } from './actions';
import { useCurrency } from '@/context/currency-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function CarSalesClient({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);
  const { formatCurrency } = useCurrency();

  const refreshData = async () => {
    const updatedData = await getAllVehicles();
    setVehicles(updatedData);
  };
  
  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDialogOpen(true);
  };
  
  const summary = vehicles.reduce((acc, vehicle) => {
    if (vehicle.status === 'In-stock') {
        acc.inStockCount++;
        acc.inStockValue += vehicle.purchasePrice || 0;
    } else if (vehicle.status === 'Sold') {
        acc.soldCount++;
        acc.totalProfit += vehicle.profitOrLoss || 0;
    }
    return acc;
  }, { inStockCount: 0, inStockValue: 0, soldCount: 0, totalProfit: 0 });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Car Sales Management</h1>
          <p className="text-muted-foreground">
            Track vehicle purchases, sales, and profitability.
          </p>
        </div>
        <Button onClick={() => { setSelectedVehicle(undefined); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicles In Stock</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{summary.inStockCount}</div>
                <p className="text-xs text-muted-foreground">Total purchase value: {formatCurrency(summary.inStockValue)}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicles Sold</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{summary.soldCount}</div>
                 <p className="text-xs text-muted-foreground">Total sales transactions</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit/Loss</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(summary.totalProfit)}</div>
                 <p className="text-xs text-muted-foreground">From all sold vehicles</p>
            </CardContent>
        </Card>
      </div>

      <DataTable columns={columns({ onEdit: handleEdit, onUpdate: refreshData })} data={vehicles} />
      <AddVehicleDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        vehicle={selectedVehicle}
        onSuccess={refreshData}
      />
    </div>
  );
}
