
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { paymentSchema, type Payment } from './schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { type Landlord } from '@/app/landlord/schema';
import { type Vendor } from '@/app/vendors/schema';
import { type Customer } from '@/app/tenancy/customer/schema';
import { type BankAccount } from '@/app/finance/banking/schema';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { applyPaymentToInvoices } from '@/app/tenancy/customer/invoice/actions';

const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const landlordsFilePath = path.join(process.cwd(), 'src/app/landlord/landlords-data.json');
const vendorsFilePath = path.join(process.cwd(), 'src/app/vendors/vendors-data.json');
const customersFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/customers-data.json');
const bankAccountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');


async function readPayments(): Promise<Payment[]> {
    try {
        await fs.access(paymentsFilePath);
        const data = await fs.readFile(paymentsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writePayments([]);
            return [];
        }
        throw error;
    }
}

async function writePayments(data: Payment[]) {
    await fs.writeFile(paymentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readBankAccounts(): Promise<BankAccount[]> {
    try {
        const data = await fs.readFile(bankAccountsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeBankAccounts(data: BankAccount[]) {
    await fs.writeFile(bankAccountsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getPayments() {
    const payments = await readPayments();
    return payments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const addPaymentFormSchema = paymentSchema.omit({ id: true }).extend({
    invoiceAllocations: z.array(z.object({
        invoiceId: z.string(),
        amount: z.number(),
    })).optional(),
});


export async function addPayment(data: z.infer<typeof addPaymentFormSchema>) {
    const validation = addPaymentFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const { invoiceAllocations, ...paymentData } = validation.data;

    try {
        // Adjust bank balance if it's an outgoing payment from a bank account
        if (paymentData.type === 'Payment' && paymentData.bankAccountId) {
            const allBankAccounts = await readBankAccounts();
            const bankAccountIndex = allBankAccounts.findIndex(acc => acc.id === paymentData.bankAccountId);

            if (bankAccountIndex !== -1) {
                if (allBankAccounts[bankAccountIndex].balance < paymentData.amount) {
                    return { success: false, error: 'Insufficient funds in the selected bank account.' };
                }
                allBankAccounts[bankAccountIndex].balance -= paymentData.amount;
                await writeBankAccounts(allBankAccounts);
            }
        }
        
        const allPayments = await readPayments();
        const newPayment: Payment = {
            ...paymentData,
            id: `PAY-${Date.now()}`,
        };

        allPayments.push(newPayment);
        await writePayments(allPayments);

        if (paymentData.type === 'Receipt' && paymentData.partyType === 'Customer' && invoiceAllocations && invoiceAllocations.length > 0) {
            await applyPaymentToInvoices(invoiceAllocations, paymentData.partyName);
        }
        
        revalidatePath('/finance/payment');
        revalidatePath('/finance/due-payments');
        revalidatePath('/finance/banking'); // Revalidate banking to show new balance
        if(paymentData.partyType === 'Customer') {
             revalidatePath(`/tenancy/customer/add?code=${paymentData.partyName}`);
        }
        return { success: true, data: newPayment };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function getLookups() {
    const tenants: {tenantData: Tenant}[] = await fs.readFile(tenantsFilePath, 'utf-8').then(JSON.parse).catch(() => []);
    const landlords: {landlordData: Landlord}[] = await fs.readFile(landlordsFilePath, 'utf-8').then(JSON.parse).catch(() => []);
    const vendors: {vendorData: Vendor}[] = await fs.readFile(vendorsFilePath, 'utf-8').then(JSON.parse).catch(() => []);
    const customers: {customerData: Customer}[] = await fs.readFile(customersFilePath, 'utf-8').then(JSON.parse).catch(() => []);
    const bankAccounts: BankAccount[] = await fs.readFile(bankAccountsFilePath, 'utf-8').then(JSON.parse).catch(() => []);


    return {
        tenants: tenants.map(t => ({ value: t.tenantData.name, label: t.tenantData.name, contractNo: t.tenantData.contractNo })),
        landlords: landlords.map(l => ({ value: l.landlordData.name, label: l.landlordData.name })),
        vendors: vendors.map(v => ({ value: v.vendorData.name, label: v.vendorData.name })),
        customers: customers.map(c => ({ value: c.customerData.name, label: c.customerData.name })),
        bankAccounts: bankAccounts.map(b => ({ value: b.id, label: `${b.accountName} (${b.bankName})`}))
    }
}

export async function getSummary() {
    const payments = await readPayments();
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);

    const summary = {
        totalReceivedThisMonth: 0,
        totalPaidThisMonth: 0,
    };

    for (const payment of payments) {
        const paymentDate = parseISO(payment.date);
        if (isWithinInterval(paymentDate, { start: startOfThisMonth, end: endOfThisMonth })) {
            if (payment.type === 'Receipt') {
                summary.totalReceivedThisMonth += payment.amount;
            } else if (payment.type === 'Payment') {
                summary.totalPaidThisMonth += payment.amount;
            }
        }
    }
    
    return summary;
}
