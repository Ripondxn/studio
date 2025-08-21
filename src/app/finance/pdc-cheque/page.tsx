
import { getPdcCheques, getSummary } from './actions';
import { PdcChequesClient } from './cheques-client';


export default async function PdcChequePage() {
  const cheques = await getPdcCheques();
  const summary = await getSummary();

  return (
    <PdcChequesClient initialCheques={cheques} initialSummary={summary} />
  );
}
