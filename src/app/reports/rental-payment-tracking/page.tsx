
import { getRentalPaymentData } from './actions';
import { RentalTrackingClient } from './rental-tracking-client';

export const dynamic = 'force-dynamic';

export default async function RentalPaymentTrackingPage() {
  const paymentData = await getRentalPaymentData();
  
  // For the purpose of this dashboard, we'll focus on a fixed set of months
  const displayedMonths = ['Mar-25', 'Apr-25', 'May-25', 'Jun-25'];

  return (
    <div className="container mx-auto py-10">
       <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Rental Payment Tracking</h1>
        <p className="text-muted-foreground">
          An interactive dashboard to track and manage monthly rental payments.
        </p>
      </div>
      <RentalTrackingClient initialData={paymentData} displayedMonths={displayedMonths} />
    </div>
  );
}
