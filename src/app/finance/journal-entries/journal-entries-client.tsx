
'use client';

import { useEffect, useState } from 'react';
import { getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry } from './actions';
import { type JournalEntry } from './schema';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { AddJournalEntryDialog } from './add-journal-entry-dialog';
import { getAccounts } from '../accounts/actions';
import { type Account } from '../accounts/schema';

export function JournalEntriesClient() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  async function fetchData() {
    const [entries, accs] = await Promise.all([getJournalEntries(), getAccounts()]);
    setJournalEntries(entries);
    setAccounts(accs);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSuccess = () => {
    fetchData();
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Journal Entries</h1>
      <AddJournalEntryDialog accounts={accounts} onSuccess={handleSuccess} />
      <DataTable columns={columns({ accounts, onSuccess: handleSuccess })} data={journalEntries} />
    </div>
  );
}
