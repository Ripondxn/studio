
import { getAllUtilityAccounts } from './actions';
import { UtilityClient } from './utility-client';
import { type UtilityAccount } from './schema';

export default async function UtilitiesPage() {
  const accounts: UtilityAccount[] = await getAllUtilityAccounts();

  return <UtilityClient initialAccounts={accounts} />;
}
