

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { invoiceSchema } from './schema';
import { type Invoice } from './schema';
import { addPayment } from '@/app/finance/payment/actions';
import { type Contract } from '../../contract/schema';

const invoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');
const subscriptionInvoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/invoice/subscription-invoices-data.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');

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

async function writeContracts(data: Contract[]) {
    await fs.writeFile(contractsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readContracts(): Promise<Contract[]> {
    try {
        await fs.access(contractsFilePath);
        const data = await fs.readFile(contractsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeContracts([]);
            return [];
        }
        throw error;
    }
}

async function readSubscriptionInvoices(): Promise<Invoice[]> {
    try {
        await fs.access(subscriptionInvoicesFilePath);
        const data = await fs.readFile(subscriptionInvoicesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(subscriptionInvoicesFilePath, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
        throw error;
    }
}

export async function getInvoicesForCustomer(customerCode: string) {
    const generalInvoices = await readInvoices();
    const subscriptionInvoices = await readSubscriptionInvoices();
    
    const allInvoices = [...generalInvoices, ...subscriptionInvoices];
    
    // Invoices for a tenant are those where the customerCode matches the tenantCode
    const tenantInvoices = allInvoices.filter(inv => inv.customerCode === customerCode);
    return tenantInvoices.map(inv => ({
        ...inv,
        remainingBalance: inv.total - (inv.amountPaid || 0),
    }));
}


export async function getNextGeneralInvoiceNumber() {
    const allInvoices = await readInvoices();
    let maxNum = 0;
    allInvoices.forEach(i => {
        const match = i.invoiceNo.match(/^INV-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `INV-${(maxNum + 1).toString().padStart(4, '0')}`;
}


export async function saveInvoice(data: Omit<Invoice, 'amountPaid' | 'remainingBalance'> & { isAutoInvoiceNo?: boolean }, createdBy: string) {
    const { isAutoInvoiceNo, ...invoiceData } = data;
    const validation = invoiceSchema.omit({id: true, amountPaid: true, remainingBalance: true}).safeParse(invoiceData);

    if (!validation.success) {
        console.error("Invoice Validation Error:", validation.error.format());
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allInvoices = await readInvoices();
        const isNewRecord = !data.id;
        const validatedData = validation.data;
        let savedInvoice: Invoice;

        if (isNewRecord) {
             let newInvoiceNo = validatedData.invoiceNo;
             if (isAutoInvoiceNo) {
                newInvoiceNo = await getNextGeneralInvoiceNumber();
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
                 items: validatedData.items.map(item => ({...item, id: item.id || `item-${Date.now()}-${Math.random()}`}))
            };
            allInvoices.push(newInvoice);
            savedInvoice = newInvoice;
            
        } else {
            const index = allInvoices.findIndex(inv => inv.id === data.id);
            if (index === -1) {
                return { success: false, error: 'Invoice not found.' };
            }
            allInvoices[index] = { ...allInvoices[index], ...validatedData, items: validatedData.items.map(item => ({...item, id: item.id || `item-${Date.now()}-${Math.random()}`})) };
            savedInvoice = allInvoices[index];
        }

        await writeInvoices(allInvoices);
        revalidatePath(`/tenancy/customer/add?code=${data.customerCode}`);
        revalidatePath(`/tenancy/tenants/add?code=${data.customerCode}`);
        revalidatePath('/property/units/vacant');
        revalidatePath('/property/properties');
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
        revalidatePath(`/tenancy/customer/add?code=${invoiceToDelete.customerCode}`);
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
        revalidatePath(`/tenancy/tenants/add?code=${allInvoices[index].customerCode}`);
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function applyPaymentToInvoices(invoicePayments: { invoiceId: string; amount: number }[], customerCode: string) {
    try {
        const generalInvoices = await readInvoices();
        const subscriptionInvoices = await readSubscriptionInvoices();
        let generalInvoicesModified = false;
        let subscriptionInvoicesModified = false;

        for (const payment of invoicePayments) {
            let index = generalInvoices.findIndex(inv => inv.id === payment.invoiceId);
            if (index !== -1) {
                generalInvoices[index].amountPaid = (generalInvoices[index].amountPaid || 0) + payment.amount;
                const remainingBalance = generalInvoices[index].total - generalInvoices[index].amountPaid;
                if (remainingBalance <= 0.001) {
                    generalInvoices[index].status = 'Paid';
                }
                generalInvoicesModified = true;
            } else {
                index = subscriptionInvoices.findIndex(inv => inv.id === payment.invoiceId);
                if (index !== -1) {
                    subscriptionInvoices[index].amountPaid = (subscriptionInvoices[index].amountPaid || 0) + payment.amount;
                    const remainingBalance = subscriptionInvoices[index].total - subscriptionInvoices[index].amountPaid;
                    if (remainingBalance <= 0.001) {
                        subscriptionInvoices[index].status = 'Paid';
                    }
                    subscriptionInvoicesModified = true;
                }
            }
        }

        if (generalInvoicesModified) {
            await writeInvoices(generalInvoices);
        }
        if (subscriptionInvoicesModified) {
            await fs.writeFile(subscriptionInvoicesFilePath, JSON.stringify(subscriptionInvoices, null, 2), 'utf-8');
        }

        revalidatePath(`/tenancy/customer/add?code=${customerCode}`);
        revalidatePath(`/tenancy/tenants/add?code=${customerCode}`);
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
