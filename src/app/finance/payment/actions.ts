

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { paymentSchema, type Payment } from './schema';
import { type BankAccount } from '@/app/finance/banking/schema';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, isBefore } from 'date-fns';
import { applyPaymentToInvoices } from '@/app/tenancy/customer/invoice/actions';
import { type Contract as TenancyContract } from '@/app/tenancy/contract/schema';
import { type LeaseContract } from '@/app/lease/contract/schema';
import { type Invoice } from '@/app/tenancy/customer/invoice/schema';
import { type Bill } from '@/app/vendors/bill/schema-def';
import { type Cheque } from '../cheque-deposit/schema';
import { getWorkflowSettings } from '@/app/admin/workflow-settings/actions';
import { applyFinancialImpact } from '@/app/workflow/actions';
import { type ReceiptBook } from '../book-management/schema';


const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const invoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');
const billsFilePath = path.join(process.cwd(), 'src/app/vendors/bill/bills-data.json');
const receiptBooksFilePath = path.join(process.cwd(), 'src/app/finance/book-management/receipt-books-data.json');
const tenancyContractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const leaseContractsFilePath = path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json');


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

async function readInvoices(): Promise<Invoice[]> {
    return await readData(invoicesFilePath);
}
async function writeInvoices(data: Invoice[]) {
    await fs.writeFile(invoicesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readBills(): Promise<Bill[]> {
    return await readData(billsFilePath);
}
async function writeBills(data: Bill[]) {
    await fs.writeFile(billsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function applyPaymentToBills(billPayments: { billId: string; amount: number }[], vendorCode: string) {
    try {
        const allBills = await readBills();

        for (const payment of billPayments) {
            const index = allBills.findIndex(b => b.id === payment.billId);
            if (index !== -1) {
                allBills[index].amountPaid = (allBills[index].amountPaid || 0) + payment.amount;
                const remainingBalance = allBills[index].total - allBills[index].amountPaid;
                
                if (remainingBalance <= 0.001) {
                    allBills[index].status = 'Paid';
                } else if (allBills[index].status === 'Draft' || allBills[index].status === 'Overdue') {
                    allBills[index].status = 'Sent';
                }
            }
        }

        await writeBills(allBills);
        revalidatePath(`/vendors/add?code=${vendorCode}`);
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
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

async function updateReceiptBookUsage(receiptNo: string) {
    try {
        const books = await readData(receiptBooksFilePath) as ReceiptBook[];
        const [bookNo] = receiptNo.split('-');
        if (!bookNo) return;

        const bookIndex = books.findIndex(b => b.bookNo === bookNo);
        if (bookIndex !== -1) {
            books[bookIndex].leafsUsed = (books[bookIndex].leafsUsed || 0) + 1;
             if (books[bookIndex].leafsUsed >= books[bookIndex].noOfLeafs) {
                books[bookIndex].status = 'Finished';
            }
            await writeData(receiptBooksFilePath, books);
            revalidatePath('/finance/book-management');
        }
    } catch (error) {
        console.error(`Failed to update receipt book for receipt #${receiptNo}`, error);
    }
}


export async function addPayment(data: z.infer<typeof paymentSchema>) {
    const validation = paymentSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const paymentData = validation.data;

    try {
        const allPayments = await readPayments();
        
        if (paymentData.referenceNo && paymentData.referenceType !== 'Other') {
            const isDuplicate = allPayments.some(p => 
                p.referenceNo === paymentData.referenceNo &&
                p.status !== 'Cancelled'
            );
            if (isDuplicate) {
                return { success: false, error: `A payment for reference "${paymentData.referenceNo}" already exists.` };
            }
        }

        const workflowSettings = await getWorkflowSettings();

        const initialStatus = workflowSettings.approvalProcessEnabled ? 'DRAFT' : 'POSTED';
        
        const newPayment: Payment = {
            ...paymentData,
            id: `PAY-${Date.now()}`,
            currentStatus: initialStatus,
            approvalHistory: [
              {
                action: 'Created Transaction',
                actorId: paymentData.createdByUser || 'System',
                actorRole: 'User',
                timestamp: new Date().toISOString(),
                comments: `Initial status set to ${initialStatus}`,
              },
            ],
        };
        
        if (newPayment.type === 'Receipt' && newPayment.invoiceAllocations && newPayment.invoiceAllocations.length > 0) {
            await applyPaymentToInvoices(newPayment.invoiceAllocations, newPayment.partyName);
        }

        if (newPayment.type === 'Payment' && newPayment.billAllocations && newPayment.billAllocations.length > 0) {
            await applyPaymentToBills(newPayment.billAllocations, newPayment.partyName);
        }
        
        if (newPayment.referenceType === 'Receipt Book' && newPayment.referenceNo) {
            await updateReceiptBookUsage(newPayment.referenceNo);
        }

        if (initialStatus === 'POSTED') {
            await applyFinancialImpact(newPayment);
        }
        
        allPayments.push(newPayment);
        await writePayments(allPayments);
        
        revalidateAllPaths(newPayment);
        return { success: true, data: newPayment };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

async function reverseFinancialImpact(payment: Payment) {
    if (payment.currentStatus !== 'POSTED') return; // Only reverse posted transactions

    // Reverse Cash/Bank balances
    if (payment.paymentFrom === 'Petty Cash') {
        const pettyCash = await readData(path.join(process.cwd(), 'src/app/finance/banking/petty-cash.json'));
        if (payment.type === 'Payment') {
            pettyCash.balance += payment.amount;
        } else { // Receipt
            pettyCash.balance -= payment.amount;
        }
        await writeData(path.join(process.cwd(), 'src/app/finance/banking/petty-cash.json'), pettyCash);
    } else if (payment.bankAccountId) {
            const allBankAccounts = await readData(path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json'));
            const accountIndex = allBankAccounts.findIndex(acc => acc.id === payment.bankAccountId);
            if (accountIndex !== -1) {
            if (payment.type === 'Payment') {
                allBankAccounts[accountIndex].balance += payment.amount;
            } else { // Receipt
                allBankAccounts[accountIndex].balance -= payment.amount;
            }
            await writeData(path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json'), allBankAccounts);
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
    
    // Reverse bill allocations if applicable
    if (payment.type === 'Payment' && payment.billAllocations && payment.billAllocations.length > 0) {
        const allBills = await readBills();
        payment.billAllocations.forEach(allocation => {
            const billIndex = allBills.findIndex(bill => bill.id === allocation.billId);
            if (billIndex !== -1) {
                allBills[billIndex].amountPaid = (allBills[billIndex].amountPaid || 0) - allocation.amount;
                if (allBills[billIndex].status === 'Paid') {
                    const dueDate = parseISO(allBills[billIndex].dueDate);
                    allBills[billIndex].status = isBefore(dueDate, new Date()) ? 'Overdue' : 'Sent';
                }
            }
        });
        await writeBills(allBills);
    }

    // Reverse Chart of Accounts
    const allAccounts = await readData(path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json'));
    const { type, amount, expenseAccountId, partyType } = payment;

    if (type === 'Payment' && expenseAccountId) {
        const expenseAccountIndex = allAccounts.findIndex(a => a.code === expenseAccountId);
        if(expenseAccountIndex !== -1) {
            allAccounts[expenseAccountIndex].balance -= amount;
        }
    } else if (type === 'Receipt') {
        const revenueAccountIndex = allAccounts.findIndex(a => a.code === '4110');
        if (revenueAccountIndex !== -1) {
            allAccounts[revenueAccountIndex].balance -= amount;
        }
    }

    if (partyType === 'Vendor') {
        const accountsPayableIndex = allAccounts.findIndex(a => a.code === '2110');
        if (accountsPayableIndex !== -1) {
             if (type === 'Payment') {
                allAccounts[accountsPayableIndex].balance += amount;
            } else { // Refund from vendor
                allAccounts[accountsPayableIndex].balance -= amount;
            }
        }
    }

    await writeData(path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json'), allAccounts);
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

export async function getPartyNameLookups(): Promise<Record<string, string>> {
    // This function can be moved to a central lookup file to avoid duplication
    // For now, keeping it here to fix the immediate issue.
    const tenants: {tenantData: any}[] = await readData(path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json'));
    const landlords: {landlordData: any}[] = await readData(path.join(process.cwd(), 'src/app/landlord/landlords-data.json'));
    const vendors: {vendorData: any}[] = await readData(path.join(process.cwd(), 'src/app/vendors/vendors-data.json'));
    const agents: any[] = await readData(path.join(process.cwd(), 'src/app/vendors/agents/agents-data.json'));
    const customers: {customerData: any}[] = await readData(path.join(process.cwd(), 'src/app/tenancy/customer/customers-data.json'));

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

export async function getReferences(partyType: string, partyName: string, referenceType: string, paymentType: string, collectorName?: string) {
    if (!partyType || !partyName || !referenceType) return [];
    
    const allPayments = await readPayments();
    const paidRefs = new Set(allPayments.filter(p => p.status !== 'Cancelled').map(p => p.referenceNo));
    
    let references: { value: string, label: string, amount?: number, propertyCode?: string, unitCode?: string, roomCode?: string, book?: any }[] = [];
    
    if (paymentType === 'Receipt') {
        if (referenceType === 'Tenancy Contract') {
            const contracts = await readData(tenancyContractsFilePath);
            references = contracts
                .filter((c: TenancyContract) => c.tenantCode === partyName)
                .map((c: TenancyContract) => ({
                    value: c.contractNo,
                    label: `Contract: ${c.contractNo} (Property: ${c.property})`,
                    amount: c.totalRent,
                    propertyCode: c.property,
                    unitCode: c.unitCode,
                    roomCode: c.roomCode,
                }));
        } else if (referenceType === 'Invoice') {
            const invoices = await readData(invoicesFilePath);
            references = invoices
                .filter((i: Invoice) => i.customerCode === partyName && i.status !== 'Paid' && i.status !== 'Cancelled')
                .map((i: Invoice) => ({
                    value: i.invoiceNo,
                    label: `Invoice: ${i.invoiceNo} (Due: ${i.dueDate}, Bal: ${i.total - (i.amountPaid || 0)})`,
                    amount: i.total - (i.amountPaid || 0),
                    propertyCode: i.property,
                    unitCode: i.unitCode,
                    roomCode: i.roomCode,
                }));
        } else if (referenceType === 'Receipt Book') {
            const books = await readData(receiptBooksFilePath);
            books.forEach((book: ReceiptBook) => {
                if(book.status === 'Active' && (!book.assignedTo || book.assignedTo === collectorName)) {
                     for (let i = book.receiptStartNo; i <= book.receiptEndNo; i++) {
                        const receiptNo = `${book.bookNo}-${i}`;
                        if (!paidRefs.has(receiptNo)) {
                            references.push({
                                value: receiptNo,
                                label: `Book: ${book.bookNo}, Receipt: ${i}`,
                                book: book,
                            });
                        }
                    }
                }
            });
        }
    } else { // Payment
        if (referenceType === 'Lease Contract') {
             const contracts = await readData(leaseContractsFilePath);
             references = contracts
                .filter((c: LeaseContract) => c.landlordCode === partyName)
                .map((c: LeaseContract) => ({
                    value: c.contractNo,
                    label: `Lease: ${c.contractNo} (Property: ${c.property})`,
                    amount: c.totalRent,
                    propertyCode: c.property,
                }));
        } else if (referenceType === 'Bill') {
            const bills = await readData(billsFilePath);
            references = bills
                .filter((b: Bill) => b.vendorCode === partyName && b.status !== 'Paid' && b.status !== 'Cancelled')
                .map((b: Bill) => ({
                    value: b.billNo,
                    label: `Bill: ${b.billNo} (Due: ${b.dueDate}, Bal: ${b.total - (b.amountPaid || 0)})`,
                    amount: b.total - (b.amountPaid || 0),
                    propertyCode: b.property,
                    unitCode: b.unitCode,
                    roomCode: b.roomCode,
                }));
        }
    }
    
    return references;
}
