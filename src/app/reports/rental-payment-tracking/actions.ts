
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Contract, type PaymentInstallment } from '@/app/tenancy/contract/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { format, getMonth, getYear, parseISO, isEqual } from 'date-fns';
import { revalidatePath } from 'next/cache';

const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');


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

async function readData<T>(filePath: string): Promise<T[]> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeContracts(data: Contract[]) {
    await fs.writeFile(contractsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getRentalPaymentData(): Promise<TenantPaymentData[]> {
    const contracts: Contract[] = await readData(contractsFilePath);
    const tenants: {tenantData: Tenant}[] = await readData(tenantsFilePath);

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
            flatNo: `${contract.unitCode || ''}${contract.roomCode ? ` / ${contract.roomCode}` : ''}`,
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

export async function updatePaymentStatus(contractNo: string, dueDate: string, newStatus: 'Paid' | 'Unpaid' | 'Partial') {
    try {
        const allContracts = await readData<Contract>(contractsFilePath);
        const contractIndex = allContracts.findIndex(c => c.contractNo === contractNo);

        if (contractIndex === -1) {
            return { success: false, error: 'Contract not found.' };
        }

        const contract = allContracts[contractIndex];
        const installmentIndex = contract.paymentSchedule.findIndex(p => {
             // Compare dates without time part for accuracy
            return isEqual(parseISO(p.dueDate), parseISO(dueDate));
        });
        
        if (installmentIndex === -1) {
             return { success: false, error: 'Payment installment not found for the given due date.' };
        }

        contract.paymentSchedule[installmentIndex].status = newStatus.toLowerCase() as 'paid' | 'unpaid'; // The schema uses lowercase.

        await writeContracts(allContracts);
        revalidatePath('/reports/rental-payment-tracking');
        return { success: true };

    } catch (error) {
        console.error("Failed to update payment status:", error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
