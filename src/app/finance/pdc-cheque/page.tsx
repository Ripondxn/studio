

import { ChequesClient } from '@/app/finance/cheque-management/cheques-client';
import { getCheques, getSummary } from '@/app/finance/cheque-management/actions';


export default async function PdcChequePage() {
  const cheques = await getCheques();
  const summary = await getSummary();

  return (
    <ChequesClient initialCheques={cheques} initialSummary={summary} />
  );
}


