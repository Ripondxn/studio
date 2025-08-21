
import { getDuePayments, getSummary } from './actions';
import { DuePaymentsClient } from './due-payments-client';


export default async function DuePaymentsPage() {
  const duePayments = await getDuePayments();
  const summary = await getSummary(duePayments);

  return (
    <DuePaymentsClient initialPayments={duePayments} initialSummary={summary} />
  );
}
