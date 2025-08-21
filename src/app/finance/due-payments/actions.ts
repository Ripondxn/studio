
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Contract as TenancyContract } from '@/app/tenancy/contract/schema';
import { type LeaseContract } from '@/app/lease/contract/schema';
import { type Payment } from '@/app/finance/payment/schema';
import { type DuePayment } from './schema';
import { parseISO, isBefore, startOfToday, isAfter, differenceInDays } from 'date-fns';

const tenancyContractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const leaseContractsFilePath = path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const landlordsFilePath = path.join(process.cwd(), 'src/app/landlord/landlords-data.json');

async function readData(filePath: string) {
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

export async function getDuePayments(): Promise<DuePayment[]> {
    const tenancyContracts: TenancyContract[] = await readData(tenancyContractsFilePath);
    const leaseContracts: LeaseContract[] = await readData(leaseContractsFilePath);
    const payments: Payment[] = await readData(paymentsFilePath);
    const landlords: any[] = await readData(landlordsFilePath);

    const landlordMap = new Map(landlords.map(l => [l.landlordData.code, l.landlordData.name]));

    const paidInstallments = new Set(
        payments.filter(p => p.referenceNo && p.status !== 'Cancelled').map(p => p.referenceNo)
    );
    
    const today = startOfToday();
    let dueItems: DuePayment[] = [];

    // Process Tenancy Contracts (Receivables)
    tenancyContracts.forEach(contract => {
        if (!contract.paymentSchedule) return;

        contract.paymentSchedule.forEach(installment => {
            const installmentId = `${contract.contractNo}-${installment.installment}`;
            const dueDate = parseISO(installment.dueDate);
            let status: DuePayment['status'] = 'Upcoming';

            if(paidInstallments.has(installmentId)) {
                status = 'Paid';
            } else if (isBefore(dueDate, today)) {
                status = 'Overdue';
            } else if (differenceInDays(dueDate, today) <= 30) {
                 status = 'Due Soon';
            }

            dueItems.push({
                id: installmentId,
                partyType: 'Tenant',
                partyName: contract.tenantName,
                type: 'Receivable',
                property: contract.property,
                contractNo: contract.contractNo,
                dueDate: installment.dueDate,
                amount: installment.amount,
                status,
            });
        });
    });

    // Process Lease Contracts (Payables)
    leaseContracts.forEach(contract => {
        if (!contract.paymentSchedule) return;

        contract.paymentSchedule.forEach(installment => {
            const installmentId = `${contract.contractNo}-${installment.installment}`;
            const dueDate = parseISO(installment.dueDate);
            let status: DuePayment['status'] = 'Upcoming';

            if(paidInstallments.has(installmentId)) {
                status = 'Paid';
            } else if (isBefore(dueDate, today)) {
                status = 'Overdue';
            } else if (differenceInDays(dueDate, today) <= 30) {
                 status = 'Due Soon';
            }
            
            dueItems.push({
                id: installmentId,
                partyType: 'Landlord',
                partyName: landlordMap.get(contract.landlordCode) || contract.landlordCode,
                type: 'Payable',
                property: contract.property,
                contractNo: contract.contractNo,
                dueDate: installment.dueDate,
                amount: installment.amount,
                status,
            });
        });
    });

    return dueItems.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export function getSummary(duePayments: DuePayment[]) {
    const summary = {
        totalReceivable: 0,
        totalPayable: 0,
        overdueReceivable: 0,
        overduePayable: 0,
    };

    for(const item of duePayments) {
        if(item.status === 'Paid') continue;

        if(item.type === 'Receivable') {
            summary.totalReceivable += item.amount;
            if(item.status === 'Overdue') {
                summary.overdueReceivable += item.amount;
            }
        } else { // Payable
            summary.totalPayable += item.amount;
             if(item.status === 'Overdue') {
                summary.overduePayable += item.amount;
            }
        }
    }

    return summary;
}
