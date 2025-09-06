
import { JournalEntryClient } from './client';
import { getJournalEntries } from './actions';
import { getChartOfAccounts } from '@/app/finance/chart-of-accounts/actions';

export default async function JournalEntryPage() {
  const journalEntries = await getJournalEntries();
  const chartOfAccounts = await getChartOfAccounts();

  return <JournalEntryClient initialJournalEntries={journalEntries} chartOfAccounts={chartOfAccounts} />;
}
