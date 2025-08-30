
import { getAllVendors } from './actions';
import { VendorsClient } from './vendors-client';

export default async function VendorsPage() {
  const vendors = await getAllVendors();

  return (
    <VendorsClient initialVendors={vendors} />
  );
}
