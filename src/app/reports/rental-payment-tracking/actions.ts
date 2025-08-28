
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Contract, type PaymentInstallment } from '@/app/tenancy/contract/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { type Payment } from '@/app/finance/payment/schema';
import { format, getMonth, getYear, parseISO, isEqual, isSameDay } from 'date-fns';
import { revalidatePath } from 'next/cache';

const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');


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
    property: string;
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
    const payments: Payment[] = await readData(paymentsFilePath);

    const tenantMap = new Map<string, {tenantData: Tenant}>(tenants.map(t => [t.tenantData.code, t]));
    
    // Create a map of payments by tenant code for easier lookup
    const paymentsByTenant = new Map<string, Payment[]>();
    for (const payment of payments) {
        if (payment.partyType === 'Tenant' && payment.partyName && payment.status !== 'Cancelled') {
            if (!paymentsByTenant.has(payment.partyName)) {
                paymentsByTenant.set(payment.partyName, []);
            }
            paymentsByTenant.get(payment.partyName)!.push(payment);
        }
    }

    const paymentData = contracts.map(contract => {
        const tenantInfo = tenantMap.get(contract.tenantCode || '');
        const tenantPayments = paymentsByTenant.get(contract.tenantCode || '') || [];
        
        const monthlyPayments = contract.paymentSchedule.map(installment => {
            const dueDate = parseISO(installment.dueDate);
            const monthKey = format(dueDate, 'MMM-yy');
            
            const installmentId = `${contract.contractNo}-${installment.installment}`;
            
            // Find payments related to this installment
            const relatedPayments = tenantPayments.filter(p => {
                // Direct match by reference number (most reliable)
                if (p.referenceNo === installmentId) return true;
                
                // Fallback: match by amount and due date for payments without a specific reference
                if (!p.referenceNo && p.amount === installment.amount && isSameDay(parseISO(p.date), dueDate)) {
                    return true;
                }

                // Another fallback for general payments made to the tenant
                if(!p.referenceNo && p.property === contract.property && p.unitCode === contract.unitCode && p.amount === installment.amount) {
                    return true;
                }
                
                return false;
            });
            
            const totalPaidForInstallment = relatedPayments.reduce((sum, p) => sum + p.amount, 0);
            
            let status: MonthlyPayment['status'] = 'Unpaid';
            if (totalPaidForInstallment >= installment.amount) {
                status = 'Paid';
            } else if (totalPaidForInstallment > 0) {
                status = 'Partial';
            } else {
                // Trust the status on the installment if no payments are found
                status = installment.status === 'paid' ? 'Paid' : 'Unpaid';
            }

            return {
                month: monthKey,
                amount: installment.amount,
                status: status,
                date: installment.dueDate,
            };
        });

        return {
            tenantCode: contract.tenantCode || '',
            tenantName: contract.tenantName,
            nationality: tenantInfo?.tenantData.nationality,
            mobile: tenantInfo?.tenantData.mobile,
            property: contract.property || '',
            flatNo: `${contract.unitCode || ''}${contract.roomCode ? ` / ${contract.roomCode}` : ''}`,
            rentPeriodFrom: contract.startDate,
            rentPeriodTo: contract.endDate,
            monthlyRent: contract.totalRent / 12, // Simplified for this example
            yearlyRent: contract.totalRent,
            payments: monthlyPayments,
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
