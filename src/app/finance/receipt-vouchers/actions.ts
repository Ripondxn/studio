

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { receiptVoucherSchema, type ReceiptVoucher } from './schema';
import { type ReceiptBook } from '@/app/finance/book-management/schema';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { addPayment } from '../payment/actions';
import { type Contract } from '@/app/tenancy/contract/schema';
import { type Invoice } from '@/app/tenancy/customer/invoice/schema';

const vouchersFilePath = path.join(process.cwd(), 'src/app/finance/receipt-vouchers/vouchers-data.json');
const receiptBooksFilePath = path.join(process.cwd(), 'src/app/finance/book-management/receipt-books-data.json');
const usersFilePath = path.join(process.cwd(), 'src/app/admin/user-roles/users.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const invoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');


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
    const allVouchers = await getReceiptVouchers();
    const usedReceiptNos = new Set(allVouchers.map(v => v.receiptNo));
    
    const availableReceipts: { value: string, label: string, book: ReceiptBook }[] = [];
    books.filter(b => b.status === 'Active').forEach(book => {
        for (let i = book.receiptStartNo; i <= book.receiptEndNo; i++) {
             const receiptNo = `${book.bookNo}-${i}`;
             if (!usedReceiptNos.has(receiptNo)) {
                availableReceipts.push({
                    value: receiptNo,
                    label: `Book: ${book.bookNo}, Receipt: ${i}`,
                    book: book,
                });
            }
        }
    });

    return {
        receipts: availableReceipts,
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
                referenceType: 'Receipt Book',
                referenceNo: newVoucher.receiptNo,
                description: `Payment received via Receipt Voucher #${newVoucher.receiptNo}. Collected by ${newVoucher.collectedBy}.`,
                createdByUser: createdBy,
                status: 'Received',
                property: newVoucher.property,
                unitCode: newVoucher.unitCode,
                roomCode: newVoucher.roomCode,
            });

            if (!paymentResult.success) {
                console.error(`Failed to create financial transaction for receipt ${newVoucher.receiptNo}: ${paymentResult.error}`);
                continue;
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

export async function getDueAmountForParty(partyType: 'Tenant' | 'Customer', partyCode: string) {
    let totalDue = 0;
    let property = '', unitCode = '', roomCode = '';

    if (partyType === 'Tenant') {
        const contracts = await readData<Contract>(contractsFilePath);
        const tenantContracts = contracts.filter(c => c.tenantCode === partyCode && (c.status === 'New' || c.status === 'Renew'));
        if (tenantContracts.length > 0) {
            const latestContract = tenantContracts.sort((a,b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];
            property = latestContract.property || '';
            unitCode = latestContract.unitCode || '';
            roomCode = latestContract.roomCode || '';
            latestContract.paymentSchedule.forEach(p => {
                if (p.status === 'unpaid') {
                    totalDue += p.amount;
                }
            });
        }
    } else if (partyType === 'Customer') {
        const invoices = await readData<Invoice>(invoicesFilePath);
        const customerInvoices = invoices.filter(i => i.customerCode === partyCode && i.status !== 'Paid' && i.status !== 'Cancelled');
        if (customerInvoices.length > 0) {
            const firstUnpaidInvoice = customerInvoices.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
             property = firstUnpaidInvoice.property || '';
             unitCode = firstUnpaidInvoice.unitCode || '';
             roomCode = firstUnpaidInvoice.roomCode || '';
        }
        customerInvoices.forEach(i => {
            totalDue += i.total - (i.amountPaid || 0);
        });
    }
    
    return { totalDue, property, unitCode, roomCode };
}
