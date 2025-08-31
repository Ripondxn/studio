

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getPayments } from '../payment/actions';
import { type Payment } from '../payment/schema';
import { type DailyCheckout, dailyCheckoutSchema } from './schema';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { type Contract } from '@/app/tenancy/contract/schema';
import { type Invoice } from '@/app/tenancy/customer/invoice/schema';

const checkoutsFilePath = path.join(process.cwd(), 'src/app/finance/daily-checkout/checkouts-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const invoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');


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

async function writeCheckouts(data: DailyCheckout[]) {
    await fs.writeFile(checkoutsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readPayments(): Promise<Payment[]> {
    try {
        await fs.access(paymentsFilePath);
        const data = await fs.readFile(paymentsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writePayments(data: Payment[]) {
    await fs.writeFile(paymentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getDraftTransactions(user: { email: string, role: string, name?: string }) {
    if (!user || !user.name) {
        return [];
    }
    const allPayments = await getPayments(user);
    
    return allPayments.filter(p => p.currentStatus === 'DRAFT' && p.createdByUser === user.name);
}

export async function getCheckouts(user: { email: string, name: string, role: UserRole['role'] }) {
    const allCheckouts = await readCheckouts();
    if(user.role === 'Admin' || user.role === 'Super Admin') {
        return allCheckouts;
    }
    return allCheckouts.filter(c => c.submittedBy === user.name);
}


export async function createCheckout(data: { transactionIds: string[], user: { email: string, name: string, role: UserRole['role'] }, totalAmount: number, notes?: string }) {
    const allPayments = await readPayments();
    
    const newCheckout: DailyCheckout = {
        id: `CO-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'PENDING_ADMIN_APPROVAL',
        submittedBy: data.user.name,
        totalAmount: data.totalAmount,
        transactionIds: data.transactionIds,
        notes: data.notes,
        history: [{
            action: 'Created & Submitted',
            actorId: data.user.name,
            actorRole: data.user.role,
            timestamp: new Date().toISOString(),
            comments: data.notes || 'Initial submission'
        }]
    };
    
    const allCheckouts = await readCheckouts();
    allCheckouts.push(newCheckout);
    await writeCheckouts(allCheckouts);

    // Update status of individual transactions
    const updatedPayments = allPayments.map(p => {
        if (data.transactionIds.includes(p.id!)) {
            return {
                ...p,
                currentStatus: 'PENDING_ADMIN_APPROVAL' as const,
                approvalHistory: [
                    ...(p.approvalHistory || []),
                    {
                        action: 'Submitted for Approval',
                        actorId: data.user.name,
                        actorRole: data.user.role,
                        timestamp: new Date().toISOString(),
                        comments: `Part of checkout ${newCheckout.id}`
                    }
                ]
            }
        }
        return p;
    });

    await writePayments(updatedPayments);


    revalidatePath('/finance/daily-checkout');
    revalidatePath('/workflow'); // Revalidate workflow page as well
    
    return { success: true, data: newCheckout };
}

export async function getTransactionsByIds(transactionIds: string[]): Promise<Payment[]> {
    const allPayments = await readPayments();
    return allPayments.filter(p => transactionIds.includes(p.id!));
}

export async function deleteCheckout(checkoutId: string) {
    try {
        const allCheckouts = await readCheckouts();
        const checkoutToDelete = allCheckouts.find(c => c.id === checkoutId);

        if (!checkoutToDelete) {
            return { success: false, error: 'Checkout voucher not found.' };
        }
        
        // Prevent deletion of posted vouchers
        if (checkoutToDelete.status === 'POSTED') {
            return { success: false, error: 'Cannot delete a posted voucher.' };
        }

        const updatedCheckouts = allCheckouts.filter(c => c.id !== checkoutId);
        await writeCheckouts(updatedCheckouts);

        // Revert associated transactions back to DRAFT
        const allPayments = await readPayments();
        const updatedPayments = allPayments.map(p => {
            if (checkoutToDelete.transactionIds.includes(p.id!)) {
                return {
                    ...p,
                    currentStatus: 'DRAFT' as const,
                     approvalHistory: [
                        ...(p.approvalHistory || []),
                        {
                            action: 'Checkout Deleted',
                            actorId: 'System', // Or get current user
                            actorRole: 'Admin',
                            timestamp: new Date().toISOString(),
                            comments: `Checkout voucher ${checkoutId} was deleted.`
                        }
                    ]
                };
            }
            return p;
        });
        await writePayments(updatedPayments);

        revalidatePath('/finance/daily-checkout');
        revalidatePath('/workflow');
        return { success: true };

    } catch (error) {
        console.error("Failed to delete checkout voucher:", error);
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
