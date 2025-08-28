
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { receiptVoucherSchema, type ReceiptVoucher } from './schema';
import { type ReceiptBook } from '@/app/finance/book-management/schema';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { addPayment } from '../payment/actions';

const vouchersFilePath = path.join(process.cwd(), 'src/app/finance/receipt-vouchers/vouchers-data.json');
const receiptBooksFilePath = path.join(process.cwd(), 'src/app/finance/book-management/receipt-books-data.json');
const usersFilePath = path.join(process.cwd(), 'src/app/admin/user-roles/users.json');

async function readData<T>(filePath: string, defaultValue: T[] = []): Promise<T[]> {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
            return defaultValue;
        }
        throw error;
    }
}

async function writeVouchers(data: ReceiptVoucher[]) {
    await fs.writeFile(vouchersFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getReceiptVouchers(): Promise<ReceiptVoucher[]> {
    return await readData<ReceiptVoucher>(vouchersFilePath, []);
}

export async function getReceiptVoucherLookups() {
    const books = await readData<ReceiptBook>(receiptBooksFilePath);
    const users = await readData<UserRole>(usersFilePath);
    
    const availableReceipts: { value: string, label: string }[] = [];
    books.filter(b => b.status === 'Active').forEach(book => {
        for (let i = book.receiptStartNo; i <= book.receiptEndNo; i++) {
            // This is simplified. A real system would check if 'i' is already used.
            availableReceipts.push({
                value: `${book.bookNo}-${i}`,
                label: `Book: ${book.bookNo}, Receipt: ${i}`
            });
        }
    });

    return {
        receiptNumbers: availableReceipts,
        collectors: users.map(u => ({ value: u.name, label: u.name })),
    }
}

const formSchema = receiptVoucherSchema.omit({ id: true });
export async function saveReceiptVoucher(data: z.infer<typeof formSchema>) {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
    }

    try {
        const allVouchers = await getReceiptVouchers();
        const voucherExists = allVouchers.some(v => v.receiptNo === data.receiptNo);
        if (voucherExists) {
            return { success: false, error: `A voucher with receipt number "${data.receiptNo}" already exists.` };
        }

        const newVoucher: ReceiptVoucher = {
            ...validation.data,
            id: `RV-${Date.now()}`,
        };
        
        // Create a corresponding financial transaction
        const paymentResult = await addPayment({
            type: 'Receipt',
            date: newVoucher.date,
            partyType: newVoucher.partyType,
            partyName: newVoucher.partyName,
            amount: newVoucher.amount,
            paymentMethod: newVoucher.paymentMethod,
            bankAccountId: newVoucher.bankAccountId,
            paymentFrom: newVoucher.bankAccountId ? 'Bank' : 'Petty Cash',
            referenceNo: newVoucher.receiptNo,
            description: `Payment received via Receipt Voucher #${newVoucher.receiptNo}. Collected by ${newVoucher.collectedBy}.`,
            createdByUser: newVoucher.createdBy,
            status: 'Received',
        });

        if (!paymentResult.success) {
            return { success: false, error: `Failed to create financial transaction: ${paymentResult.error}` };
        }

        allVouchers.push(newVoucher);
        await writeVouchers(allVouchers);

        // Update the receipt book usage
        const books = await readData<ReceiptBook>(receiptBooksFilePath);
        const [bookNo, receiptNoStr] = data.receiptNo.split('-');
        const receiptNo = parseInt(receiptNoStr, 10);
        
        const bookIndex = books.findIndex(b => b.bookNo === bookNo);
        if(bookIndex !== -1) {
            books[bookIndex].leafsUsed = (books[bookIndex].leafsUsed || 0) + 1;
            if (books[bookIndex].leafsUsed >= books[bookIndex].noOfLeafs) {
                books[bookIndex].status = 'Finished';
            }
             await fs.writeFile(receiptBooksFilePath, JSON.stringify(books, null, 2), 'utf-8');
        }

        revalidatePath('/finance/receipt-vouchers');
        revalidatePath('/finance/book-management');
        revalidatePath('/finance/payment');
        return { success: true, data: newVoucher };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
