

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { saveInvoice } from '@/app/tenancy/customer/invoice/actions';
import { type Invoice, subscriptionInvoiceSchema } from './schema';
import { z } from 'zod';

const invoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');

async function readInvoices(): Promise<Invoice[]> {
    try {
        await fs.access(invoicesFilePath);
        const data = await fs.readFile(invoicesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
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


export async function saveSubscriptionInvoice(data: Omit<Invoice, 'id' | 'amountPaid' | 'remainingBalance'>, createdBy: string) {
    // This function now correctly passes all data to the main saveInvoice function.
    return saveInvoice(data, createdBy);
}
