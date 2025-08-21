
import { getCheques, getSummary } from './actions';
import { ChequesClient } from './cheques-client';


export default async function ChequeDepositPage() {
  const cheques = await getCheques();
  const summary = await getSummary();

  return (
    <ChequesClient initialCheques={cheques} initialSummary={summary} />
  );
}
