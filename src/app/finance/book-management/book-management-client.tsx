
"use client"

import { useEffect, useState } from "react"
import { getJournalEntries, getAccounts, createJournalEntry } from "./actions"
import { JournalEntry, Account, journalEntrySchema } from "./data"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { AddJournalEntryDialog } from "./add-journal-entry-dialog"
import { z } from "zod"

export function BookManagementClient() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    async function fetchData() {
      const [entries, accs] = await Promise.all([getJournalEntries(), getAccounts()]);
      setJournalEntries(entries);
      setAccounts(accs);
    }
    fetchData()
  }, [])

  const handleSave = async (data: Omit<JournalEntry, 'id' | 'status'>) => {
    try {
      await createJournalEntry(data);
      const entries = await getJournalEntries();
      setJournalEntries(entries);
    } catch (error) {
      console.error("Failed to save journal entry", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Book Management</h1>
      <AddJournalEntryDialog accounts={accounts} onSave={handleSave} />
      <DataTable columns={columns} data={journalEntries} />
    </div>
  )
}
