
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { invoiceSchema, type Invoice } from './schema';
import { addPayment } from '@/app/finance/payment/actions';

const invoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/invoice/invoices-data.json');

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

export async function getInvoicesForTenant(tenantCode: string) {
    const allInvoices = await readInvoices();
    // Invoices for a tenant are those where the customerCode matches the tenantCode
    const tenantInvoices = allInvoices.filter(inv => inv.customerCode === tenantCode);
    return tenantInvoices.map(inv => ({
        ...inv,
        remainingBalance: inv.total - (inv.amountPaid || 0),
    }));
}


export async function getNextInvoiceNumber() {
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


export async function saveInvoice(data: Omit<Invoice, 'id' | 'amountPaid'> & { id?: string, isAutoInvoiceNo?: boolean }, createdBy: string) {
    const { isAutoInvoiceNo, ...invoiceData } = data;
    const validation = invoiceSchema.omit({id: true, amountPaid: true, remainingBalance: true}).safeParse(invoiceData);

    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allInvoices = await readInvoices();
        const isNew = !data.id;
        const validatedData = validation.data;
        let savedInvoice: Invoice;

        if (isNew) {
            let newInvoiceNo = validatedData.invoiceNo;
            if (isAutoInvoiceNo || !newInvoiceNo) {
                 newInvoiceNo = await getNextInvoiceNumber();
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
            };
            allInvoices.push(newInvoice);
            savedInvoice = newInvoice;

            // Create a corresponding payment receipt record for the workflow
            await addPayment({
                type: 'Receipt',
                date: newInvoice.invoiceDate,
                partyType: 'Customer', // Invoices are for customers (who can also be tenants)
                partyName: newInvoice.customerCode,
                amount: newInvoice.total,
                paymentMethod: 'Other', // Default for generated invoices
                referenceType: 'Invoice',
                referenceNo: newInvoice.invoiceNo,
                description: `Invoice generated for ${newInvoice.customerName}`,
                status: 'Received',
                createdByUser: createdBy,
                invoiceAllocations: [{ invoiceId: newInvoice.id, amount: newInvoice.total }],
            });

        } else {
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

export async function deleteInvoice(invoiceId: string) {
    try {
        const allInvoices = await readInvoices();
        const invoiceToDelete = allInvoices.find(inv => inv.id === invoiceId);
        if (!invoiceToDelete) {
             return { success: false, error: 'Invoice not found.' };
        }

        const updatedInvoices = allInvoices.filter(inv => inv.id !== invoiceId);
        await writeInvoices(updatedInvoices);
        revalidatePath(`/tenancy/tenants/add?code=${invoiceToDelete.customerCode}`);
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
