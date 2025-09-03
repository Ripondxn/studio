

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Invoice, subscriptionInvoiceSchema } from './schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const subscriptionInvoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/invoice/subscription-invoices-data.json');

async function readSubscriptionInvoices(): Promise<Invoice[]> {
    try {
        await fs.access(subscriptionInvoicesFilePath);
        const data = await fs.readFile(subscriptionInvoicesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeSubscriptionInvoices([]);
            return [];
        }
        throw error;
    }
}

async function writeSubscriptionInvoices(data: Invoice[]) {
    await fs.writeFile(subscriptionInvoicesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getNextSubscriptionInvoiceNumber() {
    const allInvoices = await readSubscriptionInvoices();
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


export async function saveSubscriptionInvoice(data: Omit<Invoice, 'id' | 'amountPaid' | 'remainingBalance'> & {id?: string, isAutoInvoiceNo?: boolean}, createdBy: string) {
    const { isAutoInvoiceNo, id, ...invoiceData } = data;
    const validation = subscriptionInvoiceSchema.safeParse(invoiceData);
    
    if (!validation.success) {
        console.error("Subscription Invoice Validation Error:", validation.error.format());
        return { success: false, error: 'Invalid subscription invoice data format.' };
    }

    try {
        const allInvoices = await readSubscriptionInvoices();
        const isNewRecord = !id;
        const validatedData = validation.data;
        let savedInvoice: Invoice;

        if (isNewRecord) {
             let newInvoiceNo = validatedData.invoiceNo;
             if (isAutoInvoiceNo) {
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
                id: `SUB-INV-${Date.now()}`,
                amountPaid: 0,
                remainingBalance: validatedData.total,
                 items: validatedData.items.map(item => ({...item, id: item.id || `item-${Date.now()}-${Math.random()}`}))
            };
            allInvoices.push(newInvoice);
            savedInvoice = newInvoice;
            
        } else {
            const index = allInvoices.findIndex(inv => inv.id === id);
            if (index === -1) {
                return { success: false, error: 'Subscription Invoice not found.' };
            }
            const existingInvoice = allInvoices[index];
            allInvoices[index] = { ...existingInvoice, ...validatedData, items: validatedData.items.map(item => ({...item, id: item.id || `item-${Date.now()}-${Math.random()}`})) };
            allInvoices[index].remainingBalance = allInvoices[index].total - allInvoices[index].amountPaid;
            savedInvoice = allInvoices[index];
        }

        await writeSubscriptionInvoices(allInvoices);
        revalidatePath(`/tenancy/tenants/add?code=${validatedData.customerCode}`);
        return { success: true, data: savedInvoice };

    } catch (error) {
        console.error("Error in saveSubscriptionInvoice:", error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
