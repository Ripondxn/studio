
'use server';

import { firestore } from "@/lib/firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { journalEntrySchema } from "./data";
import { z } from "zod";

export async function createJournalEntry(entry: Omit<z.infer<typeof journalEntrySchema>, 'id' | 'status'>) {
  const validatedEntry = journalEntrySchema.omit({ id: true }).parse({ ...entry, status: "DRAFT" });
  try {
    const docRef = await addDoc(collection(firestore, "journal_entries"), validatedEntry);
    return { id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to create journal entry.");
  }
}

export async function getJournalEntries() {
  const querySnapshot = await getDocs(collection(firestore, "journal_entries"));
  const entries = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as z.infer<typeof journalEntrySchema>[];
  return entries;
}

export async function getAccounts() {
    // This is a placeholder. In a real application, you would fetch this from Firestore.
    return [
        { id: "1", name: "Cash", type: "asset" },
        { id: "2", name: "Accounts Receivable", type: "asset" },
        { id: "3", name: "Office Supplies", type: "asset" },
        { id: "4", name: "Accounts Payable", type: "liability" },
        { id: "5", name: "Owner's Equity", type: "equity" },
        { id: "6", name: "Service Revenue", type: "revenue" },
        { id: "7", name: "Rent Expense", type: "expense" },
    ];
}

export async function updateJournalEntryStatus(id: string, status: z.infer<typeof journalEntrySchema>['status']) {
  try {
    const entryRef = doc(firestore, "journal_entries", id);
    await updateDoc(entryRef, { status });
    return { success: true };
  } catch (e) {
    console.error("Error updating document: ", e);
    throw new Error("Failed to update journal entry status.");
  }
}
