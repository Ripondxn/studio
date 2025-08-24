
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getPayments } from '../payment/actions';
import { type Payment } from '../payment/schema';
import { type DailyCheckout, dailyCheckoutSchema } from './schema';

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

export async function getDraftTransactions(user: { email: string, role: string }) {
    const allPayments = await getPayments(user);
    
    return allPayments.filter(p => p.currentStatus === 'DRAFT' && p.createdByUser === user.email);
}

export async function getCheckouts(user: { email: string, role: string }) {
    const allCheckouts = await readCheckouts();
    if(user.role === 'Admin' || user.role === 'Super Admin') {
        return allCheckouts;
    }
    return allCheckouts.filter(c => c.submittedBy === user.email);
}


export async function createCheckout(data: { transactionIds: string[], submittedBy: string, totalAmount: number, notes?: string }) {
    const newCheckout: DailyCheckout = {
        id: `CO-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'PENDING_ADMIN_APPROVAL',
        submittedBy: data.submittedBy,
        totalAmount: data.totalAmount,
        transactionIds: data.transactionIds,
        notes: data.notes,
        history: [{
            action: 'Created & Submitted',
            actorId: data.submittedBy,
            timestamp: new Date().toISOString(),
            comments: data.notes || 'Initial submission'
        }]
    };
    
    const allCheckouts = await readCheckouts();
    allCheckouts.push(newCheckout);
    await writeCheckouts(allCheckouts);

    revalidatePath('/finance/daily-checkout');
    revalidatePath('/workflow'); // Assuming it might appear here too
    
    return { success: true, data: newCheckout };
}

