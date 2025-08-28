
import { getCheques, getSummary } from './actions';
import { ChequesClient } from './cheques-client.tsx';


export default async function ChequeManagementPage() {
  const cheques = await getCheques();
  const summary = await getSummary();

  return (
    <ChequesClient initialCheques={cheques} initialSummary={summary} />
  );
}
