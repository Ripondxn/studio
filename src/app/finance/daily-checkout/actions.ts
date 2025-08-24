

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getPayments } from '../payment/actions';
import { type Payment } from '../payment/schema';
import { type DailyCheckout, dailyCheckoutSchema } from './schema';
import { type UserRole } from '@/app/admin/user-roles/schema';

const checkoutsFilePath = path.join(process.cwd(), 'src/app/finance/daily-checkout/checkouts-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');


async function readCheckouts(): Promise<DailyCheckout[]> {
    try {
        await fs.access(checkoutsFilePath);
        const data = await fs.readFile(checkoutsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeCheckouts([]);
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
