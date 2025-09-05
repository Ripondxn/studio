
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';
import { Cheque, chequeSchema, ChequeBook, chequeBookSchema, ChequeLeaf } from './schema';

const chequesFilePath = path.join(process.cwd(), 'src/data/cheques-data.json');
const chequeBooksFilePath = path.join(process.cwd(), 'src/data/cheque-books-data.json');

async function readData(filePath: string) {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeCheques(data: Cheque[]) {
    await fs.writeFile(chequesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function writeChequeBooks(data: ChequeBook[]) {
    await fs.writeFile(chequeBooksFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getCheques(filters: { party?: string; status?: string } = {}) {
    let cheques = await readData(chequesFilePath);
    if (filters.party) {
        cheques = cheques.filter(cheque => cheque.partyName.toLowerCase().includes(filters.party!.toLowerCase()));
    }
    if (filters.status) {
        cheques = cheques.filter(cheque => cheque.status === filters.status);
    }
    return cheques;
}

export async function addCheque(data: Omit<Cheque, 'id' | 'status'>) {
    const validation = chequeSchema.omit({ id: true, status: true }).safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    const allCheques = await readData(chequesFilePath);
    const newCheque: Cheque = {
        ...validation.data,
        id: `CHQ-${Date.now()}`,
        status: 'In Hand',
    };
    allCheques.push(newCheque);
    await writeCheques(allCheques);
    revalidatePath('/finance/cheque-management');
    return { success: true };
}

export async function depositCheques(chequeIds: string[], depositDate: string, bankAccountId: string) {
    if (!chequeIds || chequeIds.length === 0) return { success: false, error: 'No cheques selected.' };
    let allCheques = await readData(chequesFilePath);
    allCheques = allCheques.map(cheque => 
        chequeIds.includes(cheque.id) 
            ? { ...cheque, status: 'Deposited', depositDate, bankAccountId } 
            : cheque
    );
    await writeCheques(allCheques);
    revalidatePath('/finance/cheque-management');
    return { success: true };
}

export async function returnCheque(chequeId: string, returnDate: string, reason: string) {
    let allCheques = await readData(chequesFilePath);
    const chequeIndex = allCheques.findIndex(c => c.id === chequeId);
    if (chequeIndex === -1) return { success: false, error: 'Cheque not found.' };
    allCheques[chequeIndex] = { ...allCheques[chequeIndex], status: 'Returned', returnDate, returnReason: reason };
    await writeCheques(allCheques);
    revalidatePath('/finance/cheque-management');
    return { success: true };
}

export async function withdrawCheques(chequeIds: string[]) {
    if (!chequeIds || chequeIds.length === 0) return { success: false, error: 'No cheques selected.' };
    let allCheques = await readData(chequesFilePath);
    allCheques = allCheques.map(cheque => chequeIds.includes(cheque.id) ? { ...cheque, status: 'Withdrawn' } : cheque);
    await writeCheques(allCheques);
    revalidatePath('/finance/cheque-management');
    return { success: true };
}

export async function getChequeBooks() {
    return await readData(chequeBooksFilePath);
}

export async function getChequeLeaves(filters: { bank?: string; bookNo?: string; status?: string } = {}): Promise<ChequeLeaf[]> {
    const books = await getChequeBooks();
    const cheques = await getCheques();
    let leaves: ChequeLeaf[] = [];

    for (const book of books) {
        for (let i = book.chequeStartNo; i <= book.chequeEndNo; i++) {
            const chequeNo = i.toString().padStart(6, '0');
            const usedCheque = cheques.find(c => c.chequeNo === chequeNo && c.bookNo === book.bookNo);
            leaves.push({
                id: `${book.id}-${chequeNo}`,
                chequeNo: chequeNo,
                bookNo: book.bookNo,
                bankName: book.bankName,
                status: usedCheque ? 'Used' : 'Unused',
                partyName: usedCheque?.partyName,
                date: usedCheque?.date,
                amount: usedCheque?.amount
            });
        }
    }

    if (filters.bank) {
        leaves = leaves.filter(leaf => leaf.bankName === filters.bank);
    }
    if (filters.bookNo) {
        leaves = leaves.filter(leaf => leaf.bookNo === filters.bookNo);
    }
    if (filters.status) {
        leaves = leaves.filter(leaf => leaf.status === filters.status);
    }

    return leaves;
}

export async function addChequeBook(data: Omit<ChequeBook, 'id' | 'leafsUsed'>) {
    const validation = chequeBookSchema.omit({ id: true, leafsUsed: true }).safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const allBooks = await getChequeBooks();
    const newBook: ChequeBook = {
        ...validation.data,
        id: `CB-${Date.now()}`,
        leafsUsed: 0,
    };

    if (allBooks.some(book => book.bookNo === newBook.bookNo)) {
        return { success: false, error: 'A cheque book with this book number already exists.' };
    }

    allBooks.push(newBook);
    
    await writeChequeBooks(allBooks);
    revalidatePath('/finance/cheque-management');
    return { success: true };
}

export async function updateChequeBook(data: Omit<ChequeBook, 'leafsUsed'>) {
    const validation = chequeBookSchema.omit({ leafsUsed: true }).safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    const allBooks = await getChequeBooks();
    const bookIndex = allBooks.findIndex(b => b.id === data.id);
    if (bookIndex === -1) {
        return { success: false, error: 'Cheque book not found.' };
    }

    if (allBooks.some(book => book.bookNo === data.bookNo && book.id !== data.id)) {
        return { success: false, error: 'A cheque book with this book number already exists.' };
    }
    
    const currentBook = allBooks[bookIndex];
    allBooks[bookIndex] = {
      ...currentBook,
      ...validation.data,
      id: currentBook.id,
    };
    
    await writeChequeBooks(allBooks);
    revalidatePath('/finance/cheque-management');
    return { success: true };
}

export async function deleteChequeBook(id: string) {
    const allBooks = await getChequeBooks();
    const updatedBooks = allBooks.filter(b => b.id !== id);
    if (allBooks.length === updatedBooks.length) {
        return { success: false, error: 'Cheque book not found.' };
    }
    await writeChequeBooks(updatedBooks);
    revalidatePath('/finance/cheque-management');
    return { success: true };
}
