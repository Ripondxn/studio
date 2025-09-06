
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { JournalEntry } from './schema';
import { JournalEntryDataTable } from './data-table';
import { JournalEntryDialog } from './form';
import { columns } from './columns';
import { type ChartOfAccount } from '../chart-of-accounts/schema';


interface JournalEntryClientProps {
  initialJournalEntries: JournalEntry[];
  chartOfAccounts: ChartOfAccount[];
}

export function JournalEntryClient({ initialJournalEntries, chartOfAccounts }: JournalEntryClientProps) {
  const [journalEntries, setJournalEntries] = useState(initialJournalEntries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);

  const handleSave = (entry: JournalEntry) => {
    if (selectedEntry) {
      setJournalEntries(journalEntries.map(e => e.id === entry.id ? entry : e));
    } else {
      setJournalEntries([...journalEntries, { ...entry, id: `${Date.now()}` }]);
    }
  };

  const openDialog = (entry?: JournalEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Journal Entries</h1>
        <Button onClick={() => openDialog()}>Add Entry</Button>
      </div>
      <JournalEntryDataTable columns={columns({ onEdit: openDialog, onDelete: () => {} })} data={journalEntries} />
      <JournalEntryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        journalEntry={selectedEntry}
        chartOfAccounts={chartOfAccounts}
      />
    </div>
  );
}
