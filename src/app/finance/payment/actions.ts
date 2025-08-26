

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { paymentSchema, type Payment } from './schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { type Landlord } from '@/app/landlord/schema';
import { type Vendor } from '@/app/vendors/schema';
import { type Agent } from '@/app/vendors/agents/schema';
import { type Customer } from '@/app/tenancy/customer/schema';
import { type BankAccount } from '@/app/finance/banking/schema';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, isBefore } from 'date-fns';
import { applyPaymentToInvoices } from '@/app/tenancy/customer/invoice/actions';
import { type Contract as TenancyContract } from '@/app/tenancy/contract/schema';
import { type LeaseContract } from '@/app/lease/contract/schema';
import { type Invoice } from '@/app/tenancy/customer/invoice/schema';
import { type Bill } from '@/app/vendors/bill/schema';
import { applyPaymentToBills } from '@/app/vendors/bill/actions';
import { type Cheque } from '../cheque-deposit/schema';


const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const landlordsFilePath = path.join(process.cwd(), 'src/app/landlord/landlords-data.json');
const vendorsFilePath = path.join(process.cwd(), 'src/app/vendors/vendors-data.json');
const agentsFilePath = path.join(process.cwd(), 'src/app/vendors/agents/agents-data.json');
const customersFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/customers-data.json');
const bankAccountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const pettyCashFilePath = path.join(process.cwd(), 'src/app/finance/banking/petty-cash.json');
const tenancyContractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const leaseContractsFilePath = path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json');
const invoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');
const billsFilePath = path.join(process.cwd(), 'src/app/vendors/bill/bills-data.json');
const chequesFilePath = path.join(process.cwd(), 'src/app/finance/cheque-deposit/cheques-data.json');


async function readData(filePath: string) {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeData(filePath: string, data: any) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


async function readPayments(): Promise<Payment[]> {
    return await readData(paymentsFilePath);
}
async function writePayments(data: Payment[]) {
    await fs.writeFile(paymentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readBankAccounts(): Promise<BankAccount[]> {
    return await readData(bankAccountsFilePath);
}
async function writeBankAccounts(data: BankAccount[]) {
    await writeData(bankAccountsFilePath, data);
}

async function readPettyCash() {
    const data = await readData(pettyCashFilePath);
    if (!data || (Array.isArray(data) && data.length === 0)) return { balance: 0 };
    return data;
}
async function writePettyCash(data: { balance: number }) {
    await fs.writeFile(pettyCashFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function readInvoices(): Promise<Invoice[]> {
    return await readData(invoicesFilePath);
}
async function writeInvoices(data: Invoice[]) {
    await fs.writeFile(invoicesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function readCheques(): Promise<Cheque[]> {
    return await readData(chequesFilePath);
}
async function writeCheques(data: Cheque[]) {
    await writeData(chequesFilePath, data);
}


export async function getPayments(user: { email: string; role: string; name?: string; }) {
    const allPayments = await readPayments();
    
    // Filter out cancelled payments from the main view
    const activePayments = allPayments.filter(p => p.status !== 'Cancelled');
    
    if (user.role === 'Admin' || user.role === 'Super Admin') {
        return activePayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    const userPayments = activePayments.filter(p => p.createdByUser === user.name);

    return userPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addPayment(data: z.infer<typeof paymentSchema>) {
    const validation = paymentSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const paymentData = validation.data;

    try {
        const allPayments = await readPayments();
        
        const newPayment: Payment = {
            ...paymentData,
            id: `PAY-${Date.now()}`,
            currentStatus: 'DRAFT',
            approvalHistory: [
              {
                action: 'Created Transaction',
                actorId: paymentData.createdByUser || 'System',
                actorRole: 'User',
                timestamp: new Date().toISOString(),
                comments: 'Initial Draft',
              },
            ],
        };
        
        if (newPayment.type === 'Receipt' && newPayment.invoiceAllocations && newPayment.invoiceAllocations.length > 0) {
            await applyPaymentToInvoices(newPayment.invoiceAllocations, newPayment.partyName);
        }

        if (newPayment.type === 'Payment' && newPayment.billAllocations && newPayment.billAllocations.length > 0) {
            await applyPaymentToBills(newPayment.billAllocations, newPayment.partyName);
        }

        allPayments.push(newPayment);
        await writePayments(allPayments);
        
        revalidatePath('/finance/payment');
        revalidatePath('/finance/banking');
        revalidatePath('/finance/chart-of-accounts');
        revalidatePath('/vendors/agents');
        revalidatePath('/workflow');
        revalidatePath(`/tenancy/customer/add?code=${newPayment.partyName}`);
        revalidatePath(`/vendors/add?code=${newPayment.partyName}`);
        return { success: true, data: newPayment };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

async function reverseFinancialImpact(payment: Payment) {
    if (payment.paymentFrom === 'Petty Cash') {
        const pettyCash = await readPettyCash();
        if (payment.type === 'Payment') {
            pettyCash.balance += payment.amount;
        } else { // Receipt
            pettyCash.balance -= payment.amount;
        }
        await writePettyCash(pettyCash);
    } else if (payment.bankAccountId) {
            const allBankAccounts = await readBankAccounts();
            const accountIndex = allBankAccounts.findIndex(acc => acc.id === payment.bankAccountId);
            if (accountIndex !== -1) {
            if (payment.type === 'Payment') {
                allBankAccounts[accountIndex].balance += payment.amount;
            } else { // Receipt
                allBankAccounts[accountIndex].balance -= payment.amount;
            }
            await writeBankAccounts(allBankAccounts);
            }
    }
    
    // Reverse invoice allocations if applicable
    if (payment.type === 'Receipt' && payment.invoiceAllocations && payment.invoiceAllocations.length > 0) {
        const allInvoices = await readInvoices();
        payment.invoiceAllocations.forEach(allocation => {
            const invoiceIndex = allInvoices.findIndex(inv => inv.id === allocation.invoiceId);
            if (invoiceIndex !== -1) {
                allInvoices[invoiceIndex].amountPaid = (allInvoices[invoiceIndex].amountPaid || 0) - allocation.amount;
                if (allInvoices[invoiceIndex].status === 'Paid') {
                    const dueDate = parseISO(allInvoices[invoiceIndex].dueDate);
                    allInvoices[invoiceIndex].status = isBefore(dueDate, new Date()) ? 'Overdue' : 'Sent';
                }
            }
        });
        await writeInvoices(allInvoices);
    }
}

async function applyFinancialImpact(payment: Payment) {
    if (payment.paymentFrom === 'Petty Cash') {
        const pettyCash = await readPettyCash();
        if (payment.type === 'Payment') {
            pettyCash.balance -= payment.amount;
        } else {
            pettyCash.balance += payment.amount;
        }
        await writePettyCash(pettyCash);
    } else if (payment.bankAccountId) {
        const allBankAccounts = await readBankAccounts();
        const accountIndex = allBankAccounts.findIndex(acc => acc.id === payment.bankAccountId);
        if (accountIndex !== -1) {
            if (payment.type === 'Payment') {
                allBankAccounts[accountIndex].balance -= payment.amount;
            } else {
                allBankAccounts[accountIndex].balance += payment.amount;
            }
            await writeBankAccounts(allBankAccounts);
        }
    }
     if (payment.type === 'Receipt' && payment.invoiceAllocations && payment.invoiceAllocations.length > 0) {
        await applyPaymentToInvoices(payment.invoiceAllocations, payment.partyName);
    }
}


export async function cancelPayment(paymentId: string) {
    try {
        const allPayments = await readPayments();
        const paymentIndex = allPayments.findIndex(p => p.id === paymentId);

        if (paymentIndex === -1) {
            return { success: false, error: 'Payment not found.' };
        }
        
        const paymentToCancel = allPayments[paymentIndex];

        if(paymentToCancel.status === 'Cancelled') {
            return { success: false, error: 'Payment is already cancelled.'};
        }
        
        if(paymentToCancel.currentStatus === 'POSTED') {
           await reverseFinancialImpact(paymentToCancel);
        }
        
        allPayments[paymentIndex].status = 'Cancelled';
        await writePayments(allPayments);

        revalidateAllPaths(paymentToCancel);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function restorePayment(paymentId: string) {
    try {
        const allPayments = await readPayments();
        const paymentIndex = allPayments.findIndex(p => p.id === paymentId);

        if (paymentIndex === -1) {
            return { success: false, error: 'Payment not found.' };
        }
        
        const paymentToRestore = allPayments[paymentIndex];

        if(paymentToRestore.status !== 'Cancelled') {
            return { success: false, error: 'Payment is not cancelled.'};
        }
        
        if(paymentToRestore.currentStatus === 'POSTED') {
           await applyFinancialImpact(paymentToRestore);
        }
        
        // Restore to a sensible previous state
        allPayments[paymentIndex].status = paymentToRestore.type === 'Payment' ? 'Paid' : 'Received';
        await writePayments(allPayments);

        revalidateAllPaths(paymentToRestore);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

// Keeping this function for hard deletes (e.g. of draft transactions) if needed later
export async function deletePayment(paymentId: string) {
    try {
        const allPayments = await readPayments();
        const paymentToDelete = allPayments.find(p => p.id === paymentId);

        if (!paymentToDelete) {
            return { success: false, error: 'Payment not found.' };
        }
        
        if(paymentToDelete.currentStatus === 'POSTED') {
            await reverseFinancialImpact(paymentToDelete);
        }
        
        const updatedPayments = allPayments.filter(p => p.id !== paymentId);
        await writePayments(updatedPayments);

       revalidateAllPaths(paymentToDelete);

        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


function revalidateAllPaths(payment: Payment) {
    revalidatePath('/finance/payment');
    revalidatePath('/finance/banking');
    revalidatePath('/finance/chart-of-accounts');
    revalidatePath('/vendors/agents');
    revalidatePath('/workflow');
    revalidatePath(`/tenancy/customer/add?code=${payment.partyName}`);
    revalidatePath(`/vendors/add?code=${payment.partyName}`);
}


export async function getLookups() {
    const tenants: {tenantData: Tenant}[] = await readData(tenantsFilePath);
    const landlords: {landlordData: Landlord}[] = await readData(landlordsFilePath);
    const vendors: {vendorData: Vendor}[] = await readData(vendorsFilePath);
    const agents: Agent[] = await readData(agentsFilePath);
    const customers: {customerData: Customer}[] = await readData(customersFilePath);
    const bankAccounts: BankAccount[] = await readData(bankAccountsFilePath);

    return {
        tenants: tenants.map(t => ({ value: t.tenantData.code, label: t.tenantData.name })),
        landlords: landlords.map(l => ({ value: l.landlordData.code, label: l.landlordData.name })),
        vendors: vendors.map(v => ({ value: v.vendorData.code, label: v.vendorData.name })),
        agents: agents.map(a => ({ value: a.code, label: a.name })),
        customers: customers.map(c => ({ value: c.customerData.code, label: c.customerData.name })),
        bankAccounts: bankAccounts.map(b => ({ value: b.id, label: `${b.accountName} (${b.bankName})`}))
    }
}

export async function getPartyNameLookups(): Promise<Record<string, string>> {
    const tenants: {tenantData: Tenant}[] = await readData(tenantsFilePath);
    const landlords: {landlordData: Landlord}[] = await readData(landlordsFilePath);
    const vendors: {vendorData: Vendor}[] = await readData(vendorsFilePath);
    const agents: Agent[] = await readData(agentsFilePath);
    const customers: {customerData: Customer}[] = await readData(customersFilePath);

    const lookups: Record<string, string> = {};

    tenants.forEach(t => {
        if(t.tenantData.code) lookups[t.tenantData.code] = t.tenantData.name;
    });
    landlords.forEach(l => {
        if(l.landlordData.code) lookups[l.landlordData.code] = l.landlordData.name;
    });
    vendors.forEach(v => {
        if(v.vendorData.code) lookups[v.vendorData.code] = v.vendorData.name;
    });
     agents.forEach(a => {
        if(a.code) lookups[a.code] = a.name;
    });
    customers.forEach(c => {
        if(c.customerData.code) lookups[c.customerData.code] = c.customerData.name;
    });

    return lookups;
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
        if(payment.currentStatus !== 'POSTED') continue; 

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

export async function getReferences(partyType: string, partyCode: string, referenceType: string, paymentType?: 'Payment' | 'Receipt') {
    if (!partyType || !partyCode || !referenceType) return [];
    
    const allPayments: Payment[] = await readPayments();
    const paidInstallmentIds = new Set(allPayments.filter(p => p.status !== 'Cancelled').map(p => p.referenceNo));

    switch(referenceType) {
        case 'Tenancy Contract': {
            if (partyType !== 'Tenant') return [];
            const contracts: TenancyContract[] = await readData(tenancyContractsFilePath);
            const tenantContracts = contracts.filter(c => c.tenantCode === partyCode);
            let installments = [];
            for (const contract of tenantContracts) {
                for (const installment of contract.paymentSchedule) {
                    const installmentId = `${contract.contractNo}-${installment.installment}`;
                    if (!paidInstallmentIds.has(installmentId)) {
                        installments.push({
                            value: installmentId,
                            label: `${contract.contractNo} (Installment ${installment.installment}) - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(installment.amount)}`,
                            amount: installment.amount,
                            propertyCode: contract.property,
                            unitCode: contract.unitCode,
                            roomCode: contract.roomCode,
                        });
                    }
                }
            }
            return installments;
        }
        case 'Lease Contract': {
            if (partyType !== 'Landlord') return [];
            const contracts: LeaseContract[] = await readData(leaseContractsFilePath);
            const landlordContracts = contracts.filter(c => c.landlordCode === partyCode);
            let installments = [];
             for (const contract of landlordContracts) {
                for (const installment of contract.paymentSchedule) {
                    const installmentId = `${contract.contractNo}-${installment.installment}`;
                    if (!paidInstallmentIds.has(installmentId)) {
                         installments.push({
                            value: installmentId,
                            label: `${contract.contractNo} (Installment ${installment.installment}) - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(installment.amount)}`,
                            amount: installment.amount,
                            propertyCode: contract.property,
                        });
                    }
                }
            }
            return installments;
        }
        case 'Invoice': {
            if (partyType !== 'Customer') return [];
            const invoices: Invoice[] = await readData(invoicesFilePath);
            return invoices
                .filter(i => i.customerCode === partyCode && i.status !== 'Paid' && i.status !== 'Cancelled')
                .map(i => {
                    const remainingBalance = i.total - (i.amountPaid || 0);
                    return {
                        value: i.invoiceNo,
                        label: `${i.invoiceNo} - Bal: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(remainingBalance)}`,
                        amount: remainingBalance,
                        propertyCode: i.property,
                        unitCode: i.unitCode,
                        roomCode: i.roomCode,
                    };
                });
        }
         case 'Bill': {
            if (partyType !== 'Vendor') return [];
            const bills: Bill[] = await readData(billsFilePath);

            // If it's a refund (Receipt), show paid bills. If it's a payment, show unpaid bills.
            const filterCondition = paymentType === 'Receipt'
                ? (b: Bill) => b.vendorCode === partyCode && b.status === 'Paid'
                : (b: Bill) => b.vendorCode === partyCode && b.status !== 'Paid' && b.status !== 'Cancelled';

            return bills
                .filter(filterCondition)
                .map(b => {
                    const remainingBalance = b.total - (b.amountPaid || 0);
                     // For refunds, the amount to potentially refund is the total of the bill
                    const amountForReference = paymentType === 'Receipt' ? b.total : remainingBalance;
                    return {
                        value: b.billNo,
                        label: `${b.billNo} - Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(b.total)}`,
                        amount: amountForReference,
                        propertyCode: b.property,
                        unitCode: b.unitCode,
                        roomCode: b.roomCode,
                    };
                });
        }
        default:
            return [];
    }
}
