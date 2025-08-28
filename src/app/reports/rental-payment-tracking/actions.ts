
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Contract, type PaymentInstallment } from '@/app/tenancy/contract/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { format, getMonth, getYear } from 'date-fns';

export interface MonthlyPayment {
    month: string; // e.g., 'Mar-25'
    amount: number;
    status: 'Paid' | 'Unpaid' | 'Partial';
    date: string; // The due date for the payment
}

export interface TenantPaymentData {
    tenantCode: string;
    tenantName: string;
    nationality?: string;
    mobile?: string;
    flatNo: string;
    rentPeriodFrom: string;
    rentPeriodTo: string;
    monthlyRent: number;
    yearlyRent: number;
    payments: MonthlyPayment[];
    contractNo: string;
}

export async function getRentalPaymentData(): Promise<TenantPaymentData[]> {
    const contracts: Contract[] = await fs.readFile(path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json'), 'utf-8').then(JSON.parse);
    const tenants: {tenantData: Tenant}[] = await fs.readFile(path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json'), 'utf-8').then(JSON.parse);

    const tenantMap = new Map<string, {tenantData: Tenant}>(tenants.map(t => [t.tenantData.code, t]));

    const paymentData = contracts.map(contract => {
        const tenantInfo = tenantMap.get(contract.tenantCode || '');
        
        const payments = contract.paymentSchedule.map(installment => {
            const dueDate = new Date(installment.dueDate);
            const monthKey = format(dueDate, 'MMM-yy');
            return {
                month: monthKey,
                amount: installment.amount,
                status: installment.status === 'paid' ? 'Paid' : 'Unpaid',
                date: installment.dueDate,
            };
        });

        return {
            tenantCode: contract.tenantCode || '',
            tenantName: contract.tenantName,
            nationality: tenantInfo?.tenantData.nationality,
            mobile: tenantInfo?.tenantData.mobile,
            flatNo: `${contract.property}-${contract.unitCode}${contract.roomCode ? `/${contract.roomCode}` : ''}`,
            rentPeriodFrom: contract.startDate,
            rentPeriodTo: contract.endDate,
            monthlyRent: contract.totalRent / 12, // Simplified for this example
            yearlyRent: contract.totalRent,
            payments,
            contractNo: contract.contractNo,
        };
    });

    return paymentData;
}
