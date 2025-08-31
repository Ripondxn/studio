

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Contract as TenancyContract } from '@/app/tenancy/contract/schema';
import { type LeaseContract } from '@/app/lease/contract/schema';
import { type Invoice } from '@/app/tenancy/customer/invoice/schema';
import { parseISO, isBefore, startOfToday } from 'date-fns';

const tenancyContractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const leaseContractsFilePath = path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json');
const invoicesFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');

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

export async function getDuesForPayee(payeeCode: string) {
    if (!payeeCode) return [];

    const today = startOfToday();
    const dueItems: { label: string; value: number; reference: string, chequeNo?: string, bankName?: string }[] = [];
    const partyType = payeeCode.charAt(0);

    try {
        // Customer Invoices
        if (partyType === 'C') {
            const invoices: Invoice[] = await readData(invoicesFilePath);
            invoices.forEach(invoice => {
                const balance = invoice.total - (invoice.amountPaid || 0);
                if (invoice.customerCode === payeeCode && balance > 0 && invoice.status !== 'Cancelled') {
                    dueItems.push({
                        label: `Invoice ${invoice.invoiceNo} - Bal: ${balance.toFixed(2)}`,
                        value: balance,
                        reference: invoice.invoiceNo,
                    });
                }
            });
        }

        // Lease Contract Payables (Payments to Landlords)
        if (partyType === 'L') {
            const leaseContracts: LeaseContract[] = await readData(leaseContractsFilePath);
            leaseContracts.forEach(contract => {
                if (contract.landlordCode === payeeCode && contract.paymentSchedule) {
                    contract.paymentSchedule.forEach(installment => {
                        const dueDate = parseISO(installment.dueDate);
                        if (installment.status === 'unpaid' && !isBefore(today, dueDate)) {
                            dueItems.push({
                                label: `Lease Pymt for ${contract.property} - Inst. ${installment.installment}`,
                                value: installment.amount,
                                reference: `${contract.contractNo}-${installment.installment}`,
                                chequeNo: installment.chequeNo,
                                bankName: installment.bankName,
                            });
                        }
                    });
                }
            });
        }
        
        if (partyType === 'T') {
            const tenancyContracts: TenancyContract[] = await readData(tenancyContractsFilePath);
            tenancyContracts.forEach(contract => {
                if (contract.tenantCode === payeeCode && contract.paymentSchedule) {
                    contract.paymentSchedule.forEach(installment => {
                        const dueDate = parseISO(installment.dueDate);
                         if (installment.status === 'unpaid' && !isBefore(today, dueDate)) {
                             dueItems.push({
                                label: `Tenancy Pymt for ${contract.property}/${contract.unitCode} - Inst. ${installment.installment}`,
                                value: installment.amount,
                                reference: `${contract.contractNo}-${installment.installment}`,
                                chequeNo: installment.chequeNo,
                                bankName: installment.bankName,
                             });
                         }
                    });
                }
            });
        }

    } catch (error) {
        console.error("Error fetching dues for payee:", error);
    }

    return dueItems;
}
