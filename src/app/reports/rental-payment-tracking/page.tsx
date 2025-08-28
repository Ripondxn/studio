
import { getRentalPaymentData } from './actions';
import { RentalTrackingClient } from './rental-tracking-client';
import { getContractLookups } from '@/app/tenancy/contract/actions';

export const dynamic = 'force-dynamic';

export default async function RentalPaymentTrackingPage() {
  const paymentData = await getRentalPaymentData();
  const lookups = await getContractLookups();

  return (
    <div className="container mx-auto py-10">
       <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Rental Payment Tracking</h1>
        <p className="text-muted-foreground">
          An interactive dashboard to track and manage monthly rental payments.
        </p>
      </div>
      <RentalTrackingClient initialData={paymentData} properties={lookups.properties} />
    </div>
  );
}
