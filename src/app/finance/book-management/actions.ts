
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { chequeBookSchema, receiptBookSchema, type ChequeBook, type ReceiptBook, type ReceiptLeaf, type ChequeLeaf } from './schema';
import { type Payment } from '../payment/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { type Customer } from '@/app/tenancy/customer/schema';
import { type Landlord } from '@/app/landlord/schema';
import { type Vendor } from '@/app/vendors/schema';
import { type Agent } from '@/app/vendors/agents/schema';

const chequeBooksFilePath = path.join(process.cwd(), 'src/app/finance/book-management/cheque-books-data.json');
const receiptBooksFilePath = path.join(process.cwd(), 'src/app/finance/book-management/receipt-books-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const customersFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/customers-data.json');
const landlordsFilePath = path.join(process.cwd(), 'src/app/landlord/landlords-data.json');
const vendorsFilePath = path.join(process.cwd(), 'src/app/vendors/vendors-data.json');
const agentsFilePath = path.join(process.cwd(), 'src/app/vendors/agents/agents-data.json');


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

    if (validation.data.chequeEndNo < validation.data.chequeStartNo) {
        return { success: false, error: 'Ending number must be greater than or equal to the starting number.' };
    }

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

async function getPartyNameLookups(): Promise<Record<string, string>> {
    const tenants: {tenantData: Tenant}[] = await readData(tenantsFilePath);
    const landlords: {landlordData: Landlord}[] = await readData(landlordsFilePath);
    const vendors: {vendorData: Vendor}[] = await readData(vendorsFilePath);
    const agents: Agent[] = await readData(agentsFilePath);
    const customers: {customerData: Customer}[] = await readData(customersFilePath);

    const lookups: Record<string, string> = {};

    tenants.forEach(t => {
        if(t.tenantData.code) lookups[t.tenantData.code] = t.tenantData.name;
    });
    landlords.forEach(l => {
        if(l.landlordData.code) lookups[l.landlordData.code] = l.landlordData.name;
    });
    vendors.forEach(v => {
        if(v.vendorData.code) lookups[v.vendorData.code] = v.vendorData.name;
    });
     agents.forEach(a => {
        if(a.code) lookups[a.code] = a.name;
    });
    customers.forEach(c => {
        if(c.customerData.code) lookups[c.customerData.code] = c.customerData.name;
    });
    return lookups;
}


// Report Actions
export async function getReceiptBookReportData(): Promise<{ success: boolean, data: ReceiptLeaf[], error?: string }> {
    try {
        const books = await readData<ReceiptBook>(receiptBooksFilePath);
        const payments = await readData<Payment>(paymentsFilePath);
        const partyNameLookups = await getPartyNameLookups();
        
        const usedReceipts = new Map<string, Payment>();
        payments.forEach(p => {
            if (p.referenceType === 'Receipt Book' && p.referenceNo) {
                usedReceipts.set(p.referenceNo, p);
            }
        });

        const allLeaves: ReceiptLeaf[] = [];

        books.forEach(book => {
            for (let i = book.receiptStartNo; i <= book.receiptEndNo; i++) {
                const receiptNo = `${book.bookNo}-${i}`;
                const payment = usedReceipts.get(receiptNo);

                if (payment) {
                    allLeaves.push({
                        receiptNo,
                        bookNo: book.bookNo,
                        status: 'Used',
                        date: payment.date,
                        partyCode: payment.partyName,
                        partyName: partyNameLookups[payment.partyName] || payment.partyName,
                        amount: payment.amount,
                        collectedBy: payment.createdByUser || book.assignedTo || 'N/A',
                    });
                } else {
                    allLeaves.push({
                        receiptNo,
                        bookNo: book.bookNo,
                        status: 'Unused',
                        collectedBy: book.assignedTo || 'N/A',
                    });
                }
            }
        });
        
        return { success: true, data: allLeaves };

    } catch (error) {
        console.error('Failed to generate receipt book report:', error);
        return { success: false, error: (error as Error).message };
    }
}


export async function getChequeBookReportData(): Promise<{ success: boolean, data: ChequeLeaf[], error?: string }> {
    try {
        const books = await readData<ChequeBook>(chequeBooksFilePath);
        const payments = await readData<Payment>(paymentsFilePath);
        const partyNameLookups = await getPartyNameLookups();
        
        const usedCheques = new Map<string, Payment>();
        payments.forEach(p => {
            if (p.paymentMethod === 'Cheque' && p.referenceNo) {
                usedCheques.set(p.referenceNo, p);
            }
        });

        const allLeaves: ChequeLeaf[] = [];

        books.forEach(book => {
            for (let i = book.chequeStartNo; i <= book.chequeEndNo; i++) {
                const chequeNo = String(i);
                const payment = usedCheques.get(chequeNo);

                if (payment) {
                    allLeaves.push({
                        chequeNo,
                        bookNo: book.bookNo,
                        bankName: book.bankName,
                        status: 'Used',
                        date: payment.date,
                        partyCode: payment.partyName,
                        partyName: partyNameLookups[payment.partyName] || payment.partyName,
                        amount: payment.amount,
                    });
                } else {
                    allLeaves.push({
                        chequeNo,
                        bookNo: book.bookNo,
                        bankName: book.bankName,
                        status: 'Unused',
                    });
                }
            }
        });
        
        return { success: true, data: allLeaves };

    } catch (error) {
        console.error('Failed to generate cheque book report:', error);
        return { success: false, error: (error as Error).message };
    }
}

