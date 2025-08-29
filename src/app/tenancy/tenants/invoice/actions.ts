

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { type Invoice } from './schema';
import { subscriptionInvoiceSchema } from './schema';
import { addPayment } from '@/app/finance/payment/actions';

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


export async function getNextSubscriptionInvoiceNumber() {
    const allInvoices = await readInvoices();
    let maxNum = 0;
    allInvoices.forEach(i => {
        const match = i.invoiceNo.match(/^SUB-INV-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `SUB-INV-${(maxNum + 1).toString().padStart(4, '0')}`;
}


export async function saveSubscriptionInvoice(data: Omit<Invoice, 'id' | 'amountPaid' | 'remainingBalance'> & { id?: string, isAutoInvoiceNo?: boolean }, createdBy: string) {
    const validation = subscriptionInvoiceSchema.safeParse(data);

    if (!validation.success) {
        console.error("Subscription Invoice Validation Error:", validation.error.format());
        return { success: false, error: 'Invalid data format for subscription invoice.' };
    }

    try {
        const allInvoices = await readInvoices();
        const isNew = !data.id;
        const validatedData = validation.data;
        let savedInvoice: Invoice;

        if (isNew) {
            let newInvoiceNo = validatedData.invoiceNo;
            if (data.isAutoInvoiceNo || !newInvoiceNo) {
                 newInvoiceNo = await getNextSubscriptionInvoiceNumber();
            } else {
                const invoiceExists = allInvoices.some(inv => inv.invoiceNo === newInvoiceNo);
                if (invoiceExists) {
                    return { success: false, error: `An invoice with number "${newInvoiceNo}" already exists.`};
                }
            }

            const newInvoice: Invoice = {
                ...validatedData,
                invoiceNo: newInvoiceNo,
                id: `INV-${Date.now()}`,
                amountPaid: 0,
            };
            allInvoices.push(newInvoice);
            savedInvoice = newInvoice;
            
        } else { // Editing an existing subscription invoice
            const index = allInvoices.findIndex(inv => inv.id === data.id);
            if (index === -1) {
                return { success: false, error: 'Invoice not found.' };
            }
            allInvoices[index] = { ...allInvoices[index], ...validatedData };
            savedInvoice = allInvoices[index];
        }

        await writeInvoices(allInvoices);
        revalidatePath(`/tenancy/tenants/add?code=${data.customerCode}`);
        return { success: true, data: savedInvoice };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
