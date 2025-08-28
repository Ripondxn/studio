
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Contract } from '@/app/tenancy/contract/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { format, getMonth, getYear } from 'date-fns';

export interface MonthlyPayment {
    month: string; // e.g., 'Mar-25'
    amount: number;
    status: 'Paid' | 'Unpaid' | 'Partial';
}

export interface TenantPaymentData {
    tenantCode: string;
    tenantName: string;
    nationality?: string;
    mobile?: string;
    flatNo: string;
    totalRent: number;
    payments: MonthlyPayment[];
}

// This is a simplified function. A real-world scenario would be much more complex.
export async function getRentalPaymentData(): Promise<TenantPaymentData[]> {
    const contracts: Contract[] = await fs.readFile(path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json'), 'utf-8').then(JSON.parse);
    const tenants: {tenantData: Tenant}[] = await fs.readFile(path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json'), 'utf-8').then(JSON.parse);

    const tenantMap = new Map<string, {tenantData: Tenant}>(tenants.map(t => [t.tenantData.code, t]));

    const paymentData = contracts.map(contract => {
        const tenantInfo = tenantMap.get(contract.tenantCode || '');
        const paymentMonths = new Map<string, { expected: number; paid: number }>();

        // Populate expected amounts
        contract.paymentSchedule.forEach(installment => {
            const dueDate = new Date(installment.dueDate);
            const monthKey = format(dueDate, 'MMM-yy');
            const current = paymentMonths.get(monthKey) || { expected: 0, paid: 0 };
            current.expected += installment.amount;
            paymentMonths.set(monthKey, current);
        });
        
        // This is a placeholder for actual payment data aggregation
        // In a real app, you would fetch from a payments table.
        contract.paymentSchedule.forEach(installment => {
            if (installment.status === 'paid') {
                 const dueDate = new Date(installment.dueDate);
                 const monthKey = format(dueDate, 'MMM-yy');
                 const current = paymentMonths.get(monthKey) || { expected: 0, paid: 0 };
                 current.paid += installment.amount;
                 paymentMonths.set(monthKey, current);
            }
        });

        const payments: MonthlyPayment[] = Array.from(paymentMonths.entries()).map(([month, data]) => {
            let status: 'Paid' | 'Unpaid' | 'Partial' = 'Unpaid';
            if (data.paid >= data.expected) {
                status = 'Paid';
            } else if (data.paid > 0) {
                status = 'Partial';
            }
            return {
                month,
                amount: data.expected,
                status,
            };
        });

        // Ensure we have entries for specific months mentioned in the prompt, even if empty.
        const targetMonths = ['Mar-25', 'Apr-25', 'May-25', 'Jun-25'];
        targetMonths.forEach(m => {
            if(!paymentMonths.has(m)) {
                payments.push({ month: m, amount: 0, status: 'Unpaid' });
            }
        })


        return {
            tenantCode: contract.tenantCode || '',
            tenantName: contract.tenantName,
            nationality: tenantInfo?.tenantData.nationality,
            mobile: tenantInfo?.tenantData.mobile,
            flatNo: `${contract.property}-${contract.unitCode}${contract.roomCode ? `-${contract.roomCode}` : ''}`,
            totalRent: contract.totalRent,
            payments,
        };
    });

    return paymentData;
}
