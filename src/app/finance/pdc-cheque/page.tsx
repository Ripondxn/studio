
import { ChequesClient } from '../cheque-deposit/cheques-client';
import { getCheques, getSummary } from '../cheque-deposit/actions';


export default async function PdcChequePage() {
  const cheques = await getCheques();
  const summary = await getSummary();

  return (
    <ChequesClient initialCheques={cheques} initialSummary={summary} />
  );
}

