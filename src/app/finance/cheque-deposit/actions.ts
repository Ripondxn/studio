
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { chequeSchema, type Cheque } from './schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { type Landlord } from '@/app/landlord/schema';
import { type Contract as TenancyContract, type PaymentInstallment as TenancyPaymentInstallment } from '@/app/tenancy/contract/schema';
import { type LeaseContract, type PaymentInstallment as LeasePaymentInstallment } from '@/app/lease/contract/schema';
import { startOfWeek, endOfWeek, startOfMonth, isWithinInterval, parseISO, isBefore, startOfToday } from 'date-fns';
import { type BankAccount } from '../banking/schema';

const chequesFilePath = path.join(process.cwd(), 'src/app/finance/cheque-deposit/cheques-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const landlordsFilePath = path.join(process.cwd(), 'src/app/landlord/landlords-data.json');
const tenancyContractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const leaseContractsFilePath = path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json');
const bankAccountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');


async function readCheques(): Promise<Cheque[]> {
    try {
        await fs.access(chequesFilePath);
        const data = await fs.readFile(chequesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeCheques([]);
            return [];
        }
        throw error;
    }
}

async function writeCheques(data: Cheque[]) {
    await fs.writeFile(chequesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readBankAccounts(): Promise<BankAccount[]> {
    try {
        await fs.access(bankAccountsFilePath);
        const data = await fs.readFile(bankAccountsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeBankAccounts(data: BankAccount[]) {
    await fs.writeFile(bankAccountsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getCheques() {
    const cheques = await readCheques();
    return cheques.sort((a,b) => new Date(b.chequeDate).getTime() - new Date(a.chequeDate).getTime());
}

export async function addCheque(data: Omit<Cheque, 'id'>) {
    const validation = chequeSchema.omit({ id: true }).safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allCheques = await readCheques();
        const newCheque: Cheque = {
            ...validation.data,
            id: `CHQ-${Date.now()}`,
        };

        allCheques.push(newCheque);
        await writeCheques(allCheques);
        
        revalidatePath('/finance/cheque-deposit');
        return { success: true, data: newCheque };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function updateChequeStatus(chequeId: string, status: Cheque['status'], date: string) {
    try {
        const allCheques = await readCheques();
        const chequeIndex = allCheques.findIndex(c => c.id === chequeId);

        if (chequeIndex === -1) {
            return { success: false, error: 'Cheque not found.' };
        }
        
        const originalCheque = allCheques[chequeIndex];
        const updatedCheque = { ...originalCheque, status };
        
        if(status === 'Deposited') {
            updatedCheque.depositDate = date;
        } else if (status === 'Cleared' || status === 'Bounced') {
            updatedCheque.clearanceDate = date;
        }

        allCheques[chequeIndex] = updatedCheque;

        if (status === 'Cleared' && updatedCheque.bankAccountId) {
            const allBankAccounts = await readBankAccounts();
            const bankAccountIndex = allBankAccounts.findIndex(acc => acc.id === updatedCheque.bankAccountId);

            if (bankAccountIndex !== -1) {
                 if (updatedCheque.type === 'Incoming') {
                    allBankAccounts[bankAccountIndex].balance += updatedCheque.amount;
                } else { // Outgoing
                    allBankAccounts[bankAccountIndex].balance -= updatedCheque.amount;
                }
                await writeBankAccounts(allBankAccounts);
            }
        }
        
        await writeCheques(allCheques);
        revalidatePath('/finance/cheque-deposit');
        revalidatePath('/finance/banking');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteCheque(chequeId: string) {
    try {
        const allCheques = await readCheques();
        const updatedCheques = allCheques.filter(c => c.id !== chequeId);

        if (allCheques.length === updatedCheques.length) {
            return { success: false, error: 'Cheque not found.' };
        }

        await writeCheques(updatedCheques);
        revalidatePath('/finance/cheque-deposit');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getLookups() {
    const tenants: {tenantData: Tenant}[] = await fs.readFile(tenantsFilePath, 'utf-8').then(JSON.parse).catch(() => []);
    const landlords: {landlordData: Landlord}[] = await fs.readFile(landlordsFilePath, 'utf-8').then(JSON.parse).catch(() => []);
    const tenancyContracts: TenancyContract[] = await fs.readFile(tenancyContractsFilePath, 'utf-8').then(JSON.parse).catch(() => []);
    const leaseContracts: LeaseContract[] = await fs.readFile(leaseContractsFilePath, 'utf-8').then(JSON.parse).catch(() => []);
    const bankAccounts: BankAccount[] = await fs.readFile(bankAccountsFilePath, 'utf-8').then(JSON.parse).catch(() => []);

    const landlordMap = new Map<string, string>();
    landlords.forEach(l => landlordMap.set(l.landlordData.code, l.landlordData.name));

    return {
        tenants: tenants.map(t => ({ value: t.tenantData.name, label: t.tenantData.name, contractNo: t.tenantData.contractNo })),
        landlords: landlords.map(l => ({ value: l.landlordData.name, label: l.landlordData.name })),
        tenancyContracts: tenancyContracts.map(c => ({ value: c.contractNo, label: c.contractNo, property: c.property, partyName: c.tenantName, paymentSchedule: c.paymentSchedule })),
        leaseContracts: leaseContracts.map(c => ({ value: c.contractNo, label: c.contractNo, property: c.property, partyName: c.landlordCode ? (landlordMap.get(c.landlordCode) || c.landlordCode) : 'Unknown', paymentSchedule: c.paymentSchedule })),
        bankAccounts: bankAccounts.map(b => ({ value: b.id, label: `${b.accountName} (${b.bankName})`}))
    }
}

export async function getSummary() {
    const cheques = await readCheques();
    const now = new Date();
    const today = startOfToday();
    const startOfThisWeek = startOfWeek(now);
    const endOfThisWeek = endOfWeek(now);
    const startOfThisMonth = startOfMonth(now);

    const summary = {
        inHandCount: 0,
        inHandTotal: 0,
        dueThisWeekCount: 0,
        dueThisWeekTotal: 0,
        depositedCount: 0,
        depositedTotal: 0,
        clearedThisMonthCount: 0,
        clearedThisMonthTotal: 0,
        overdueCount: 0,
        overdueTotal: 0,
    };

    for (const cheque of cheques) {
        const chequeDate = parseISO(cheque.chequeDate);

        if (cheque.status === 'In Hand') {
            summary.inHandCount++;
            summary.inHandTotal += cheque.amount;

            if (isWithinInterval(chequeDate, { start: startOfThisWeek, end: endOfThisWeek })) {
                summary.dueThisWeekCount++;
                summary.dueThisWeekTotal += cheque.amount;
            }

            if (isBefore(chequeDate, today)) {
                summary.overdueCount++;
                summary.overdueTotal += cheque.amount;
            }

        } else if (cheque.status === 'Deposited') {
            summary.depositedCount++;
            summary.depositedTotal += cheque.amount;
        } else if (cheque.status === 'Cleared' && cheque.clearanceDate) {
             const clearanceDate = parseISO(cheque.clearanceDate);
             if (isWithinInterval(clearanceDate, { start: startOfThisMonth, end: now })) {
                summary.clearedThisMonthCount++;
                summary.clearedThisMonthTotal += cheque.amount;
             }
        }
    }
    
    return summary;
}

export async function batchDepositCheques(chequeIds: string[], depositDate: string, bankAccountId: string) {
    try {
        const allCheques = await readCheques();
        let updatedCount = 0;
        
        const updatedCheques = allCheques.map(cheque => {
            if (chequeIds.includes(cheque.id) && cheque.status === 'In Hand') {
                updatedCount++;
                return {
                    ...cheque,
                    status: 'Deposited' as const,
                    depositDate: depositDate,
                    bankAccountId: bankAccountId,
                };
            }
            return cheque;
        });

        if (updatedCount === 0) {
            return { success: false, error: "No valid 'In Hand' cheques were selected for deposit." };
        }

        await writeCheques(updatedCheques);
        revalidatePath('/finance/cheque-deposit');
        return { success: true, count: updatedCount };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function returnCheque(chequeIds: string[]) {
    try {
        const allCheques = await readCheques();
        let updatedCount = 0;
        
        const updatedCheques = allCheques.map(cheque => {
            if (chequeIds.includes(cheque.id) && cheque.status === 'In Hand') {
                updatedCount++;
                return {
                    ...cheque,
                    status: 'Returned' as const,
                };
            }
            return cheque;
        });

        if (updatedCount === 0) {
            return { success: false, error: "No valid 'In Hand' cheques were selected to return." };
        }

        await writeCheques(updatedCheques);
        revalidatePath('/finance/cheque-deposit');
        return { success: true, count: updatedCount };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
