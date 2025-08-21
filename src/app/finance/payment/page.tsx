
import { getPayments, getSummary } from './actions';
import { PaymentsClient } from './payment-client';


export default async function PaymentPage() {
  const payments = await getPayments();
  const summary = await getSummary();

  return (
    <PaymentsClient initialPayments={payments} initialSummary={summary} />
  );
}
