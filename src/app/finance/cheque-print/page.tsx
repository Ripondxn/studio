

import { ChequePrintClient } from './cheque-print-client';
import { getLookups } from '../payment/actions';

export default async function ChequePrintPage() {
  const lookups = await getLookups();

  return (
    <ChequePrintClient />
  );
}
