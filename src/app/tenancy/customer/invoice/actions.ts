

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { invoiceSchema, type Invoice } from './schema';

const invoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');

async function readInvoices(): Promise<Invoice[]> {
    try {
        await fs.access(invoicesFilePath);
        const data = await fs.readFile(invoicesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeInvoices([]);
            return [];
        }
        throw error;
    }
}

async function writeInvoices(data: Invoice[]) {
    await fs.writeFile(invoicesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getInvoicesForCustomer(customerCode: string) {
    const allInvoices = await readInvoices();
    const customerInvoices = allInvoices.filter(inv => inv.customerCode === customerCode);
    return customerInvoices.map(inv => ({
        ...inv,
        remainingBalance: inv.total - (inv.amountPaid || 0),
    }));
}

export async function saveInvoice(data: Omit<Invoice, 'id' | 'amountPaid'> & { id?: string }) {
    const validation = invoiceSchema.omit({id: true, amountPaid: true, remainingBalance: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allInvoices = await readInvoices();
        const isNew = !data.id;

        if (isNew) {
            const newInvoice: Invoice = {
                ...validation.data,
                id: `INV-${Date.now()}`,
                amountPaid: 0,
            };
            allInvoices.push(newInvoice);
        } else {
            const index = allInvoices.findIndex(inv => inv.id === data.id);
            if (index === -1) {
                return { success: false, error: 'Invoice not found.' };
            }
            allInvoices[index] = { ...allInvoices[index], ...validation.data };
        }

        await writeInvoices(allInvoices);
        revalidatePath(`/tenancy/customer/add?code=${data.customerCode}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function deleteInvoice(invoiceId: string) {
    try {
        const allInvoices = await readInvoices();
        const invoiceToDelete = allInvoices.find(inv => inv.id === invoiceId);
        if (!invoiceToDelete) {
             return { success: false, error: 'Invoice not found.' };
        }

        const updatedInvoices = allInvoices.filter(inv => inv.id !== invoiceId);
        await writeInvoices(updatedInvoices);
        revalidatePath(`/tenancy/customer/add?code=${invoiceToDelete.customerCode}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function updateInvoiceStatus(invoiceId: string, status: Invoice['status']) {
    try {
        const allInvoices = await readInvoices();
        const index = allInvoices.findIndex(inv => inv.id === invoiceId);
        if (index === -1) {
            return { success: false, error: 'Invoice not found to update status.' };
        }
        allInvoices[index].status = status;
        await writeInvoices(allInvoices);
        revalidatePath(`/tenancy/customer/add?code=${allInvoices[index].customerCode}`);
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function applyPaymentToInvoices(invoicePayments: { invoiceId: string; amount: number }[], customerCode: string) {
    try {
        const allInvoices = await readInvoices();

        for (const payment of invoicePayments) {
            const index = allInvoices.findIndex(inv => inv.id === payment.invoiceId);
            if (index !== -1) {
                allInvoices[index].amountPaid = (allInvoices[index].amountPaid || 0) + payment.amount;
                const remainingBalance = allInvoices[index].total - allInvoices[index].amountPaid;
                
                if (remainingBalance <= 0.001) { // Use a small epsilon for float comparison
                    allInvoices[index].status = 'Paid';
                } else if (allInvoices[index].status === 'Draft' || allInvoices[index].status === 'Overdue') {
                    allInvoices[index].status = 'Sent'; // Or 'Partially Paid' if you add that status
                }
            }
        }

        await writeInvoices(allInvoices);
        revalidatePath(`/tenancy/customer/add?code=${customerCode}`);
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
