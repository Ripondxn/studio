
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { JournalEntry, journalEntrySchema } from './schema';
import { z } from 'zod';

const DATA_FILE = path.join(process.cwd(), 'src/app/finance/journal-entry/journal-entries-data.json');

async function readData(): Promise<JournalEntry[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeData(data: JournalEntry[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  return await readData();
}

export async function addJournalEntry(entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> {
  const entries = await readData();
  const newEntry = { ...entry, id: `${Date.now()}` };
  const validatedEntry = journalEntrySchema.parse(newEntry);
  entries.push(validatedEntry);
  await writeData(entries);
  return validatedEntry;
}

export async function updateJournalEntry(entry: JournalEntry): Promise<JournalEntry> {
  const entries = await readData();
  const index = entries.findIndex(e => e.id === entry.id);
  if (index === -1) throw new Error('Journal entry not found');
  const validatedEntry = journalEntrySchema.parse(entry);
  entries[index] = validatedEntry;
  await writeData(entries);
  return validatedEntry;
}

export async function deleteJournalEntry(id: string): Promise<{ success: boolean }> {
  const entries = await readData();
  const filteredEntries = entries.filter(e => e.id !== id);
  await writeData(filteredEntries);
  return { success: true };
}
