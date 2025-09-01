
import { getAllVehicles } from './actions';
import { CarSalesClient } from './car-sales-client';
import { type Vehicle } from './schema';

export default async function CarSalesPage() {
  const vehicles: Vehicle[] = await getAllVehicles();

  return (
    <div className="w-full">
      <CarSalesClient initialVehicles={vehicles} />
    </div>
  );
}
