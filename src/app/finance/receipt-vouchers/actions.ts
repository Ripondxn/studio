

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
    
    // In a real app, we would also filter out used receipt numbers here.
    // For this example, we show all possible numbers.
    const availableReceipts: { value: string, label: string }[] = [];
    books.filter(b => b.status === 'Active').forEach(book => {
        for (let i = book.receiptStartNo; i <= book.receiptEndNo; i++) {
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

const batchFormSchema = z.object({
  vouchers: z.array(receiptVoucherSchema.omit({ id: true, createdBy: true })),
});

export async function saveReceiptVoucherBatch(data: z.infer<typeof batchFormSchema>, createdBy: string) {
    const validation = batchFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
    }

    try {
        const allVouchers = await getReceiptVouchers();
        const newVouchers: ReceiptVoucher[] = [];
        
        for (const voucherData of validation.data.vouchers) {
            const voucherExists = allVouchers.some(v => v.receiptNo === voucherData.receiptNo);
            if (voucherExists) {
                // Optionally skip or return error for duplicates in a batch
                console.warn(`Skipping duplicate receipt number: ${voucherData.receiptNo}`);
                continue;
            }

            const newVoucher: ReceiptVoucher = {
                ...voucherData,
                id: `RV-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                createdBy,
            };
            
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
                createdByUser: createdBy,
                status: 'Received',
            });

            if (!paymentResult.success) {
                // Rollback or handle error. For this simplified fs-based system, we'll just log and continue.
                console.error(`Failed to create financial transaction for receipt ${newVoucher.receiptNo}: ${paymentResult.error}`);
                continue; // Skip adding this voucher if payment creation fails
            }

            newVouchers.push(newVoucher);
        }

        if (newVouchers.length === 0) {
            return { success: false, error: "No valid new vouchers to save. They might be duplicates." };
        }

        allVouchers.push(...newVouchers);
        await writeVouchers(allVouchers);

        revalidatePath('/finance/receipt-vouchers');
        revalidatePath('/finance/payment');
        revalidatePath('/finance/book-management');

        return { success: true, count: newVouchers.length };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


