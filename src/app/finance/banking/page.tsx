
import { getBankAccounts } from './actions';
import { BankingClient } from './banking-client';

export default async function BankingPage() {
  const accounts = await getBankAccounts();

  return (
    <BankingClient initialAccounts={accounts} />
  );
}
