
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { journalEntrySchema, type JournalEntry } from './schema';

const journalEntriesFilePath = path.join(process.cwd(), 'src/app/finance/journal-entries/journal-entries-data.json');

async function readJournalEntries(): Promise<JournalEntry[]> {
    try {
        await fs.access(journalEntriesFilePath);
        const data = await fs.readFile(journalEntriesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(journalEntriesFilePath, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
        throw error;
    }
}

async function writeJournalEntries(data: JournalEntry[]) {
    await fs.writeFile(journalEntriesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
    return await readJournalEntries();
}


export async function createJournalEntry(data: Omit<JournalEntry, 'id'>) {
    const validation = journalEntrySchema.omit({ id: true }).safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.format() };
    }

    const entries = await readJournalEntries();
    const newEntry: JournalEntry = { ...validation.data, id: `JE-${Date.now()}` };
    entries.push(newEntry);
    await writeJournalEntries(entries);

    revalidatePath('/finance/journal-entries');
    return { success: true };
}

export async function updateJournalEntry(data: JournalEntry) {
    const validation = journalEntrySchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.format() };
    }

    const entries = await readJournalEntries();
    const index = entries.findIndex(e => e.id === data.id);
    if (index === -1) {
        return { success: false, error: 'Journal entry not found.' };
    }

    entries[index] = validation.data;
    await writeJournalEntries(entries);

    revalidatePath('/finance/journal-entries');
    return { success: true };
}

export async function deleteJournalEntry(id: string) {
    const entries = await readJournalEntries();
    const updatedEntries = entries.filter(e => e.id !== id);

    if (entries.length === updatedEntries.length) {
        return { success: false, error: 'Journal entry not found.' };
    }

    await writeJournalEntries(updatedEntries);
    revalidatePath('/finance/journal-entries');
    return { success: true };
}
