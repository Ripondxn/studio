
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { chequeBookSchema, receiptBookSchema, type ChequeBook, type ReceiptBook } from './schema';

const chequeBooksFilePath = path.join(process.cwd(), 'src/app/finance/book-management/cheque-books-data.json');
const receiptBooksFilePath = path.join(process.cwd(), 'src/app/finance/book-management/receipt-books-data.json');

async function readData<T>(filePath: string): Promise<T[]> {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeData(filePath, []);
            return [];
        }
        throw error;
    }
}

async function writeData(filePath: string, data: any) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getBooks() {
    try {
        const [chequeBooks, receiptBooks] = await Promise.all([
            readData<ChequeBook>(chequeBooksFilePath),
            readData<ReceiptBook>(receiptBooksFilePath)
        ]);
        return { success: true, data: { chequeBooks, receiptBooks } };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}


// Cheque Book Actions
const chequeBookFormSchema = chequeBookSchema.omit({ id: true });
export async function saveChequeBook(data: z.infer<typeof chequeBookFormSchema>, id?: string) {
    const validation = chequeBookFormSchema.safeParse(data);
    if (!validation.success) return { success: false, error: 'Invalid data format.' };

    const books = await readData<ChequeBook>(chequeBooksFilePath);
    if (id) { // Update
        const index = books.findIndex(b => b.id === id);
        if (index === -1) return { success: false, error: 'Cheque book not found.' };
        books[index] = { ...books[index], ...validation.data };
    } else { // Create
        const newBook: ChequeBook = { ...validation.data, id: `CB-${Date.now()}` };
        books.push(newBook);
    }
    await writeData(chequeBooksFilePath, books);
    revalidatePath('/finance/book-management');
    return { success: true };
}

export async function deleteChequeBook(id: string) {
    const books = await readData<ChequeBook>(chequeBooksFilePath);
    const updatedBooks = books.filter(b => b.id !== id);
    if (books.length === updatedBooks.length) return { success: false, error: 'Book not found.' };
    await writeData(chequeBooksFilePath, updatedBooks);
    revalidatePath('/finance/book-management');
    return { success: true };
}

// Receipt Book Actions
const receiptBookFormSchema = receiptBookSchema.omit({ id: true });
export async function saveReceiptBook(data: z.infer<typeof receiptBookFormSchema>, id?: string) {
    const validation = receiptBookFormSchema.safeParse(data);
    if (!validation.success) return { success: false, error: 'Invalid data format.' };

    const books = await readData<ReceiptBook>(receiptBooksFilePath);
    if (id) { // Update
        const index = books.findIndex(b => b.id === id);
        if (index === -1) return { success: false, error: 'Receipt book not found.' };
        books[index] = { ...books[index], ...validation.data };
    } else { // Create
        const newBook: ReceiptBook = { ...validation.data, id: `RB-${Date.now()}` };
        books.push(newBook);
    }
    await writeData(receiptBooksFilePath, books);
    revalidatePath('/finance/book-management');
    return { success: true };
}

export async function deleteReceiptBook(id: string) {
    const books = await readData<ReceiptBook>(receiptBooksFilePath);
    const updatedBooks = books.filter(b => b.id !== id);
    if (books.length === updatedBooks.length) return { success: false, error: 'Book not found.' };
    await writeData(receiptBooksFilePath, updatedBooks);
    revalidatePath('/finance/book-management');
    return { success: true };
}

