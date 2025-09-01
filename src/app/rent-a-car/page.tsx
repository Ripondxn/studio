
import { getAllRentals } from './actions';
import { RentACarClient } from './rent-a-car-client';
import { type Rental } from './schema';

export default async function RentACarPage() {
  const rentals: Rental[] = await getAllRentals();

  return (
    <div className="w-full">
      <RentACarClient initialRentals={rentals} />
    </div>
  );
}
