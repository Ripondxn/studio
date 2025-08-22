
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { pdcChequeSchema, type PdcCheque } from './schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { type Landlord } from '@/app/landlord/schema';
import { type Contract as TenancyContract, type PaymentInstallment as TenancyPaymentInstallment } from '@/app/tenancy/contract/schema';
import { type LeaseContract, type PaymentInstallment as LeasePaymentInstallment } from '@/app/lease/contract/schema';
import { startOfWeek, endOfWeek, startOfMonth, isWithinInterval, parseISO, isBefore, startOfToday } from 'date-fns';

const pdcChequesFilePath = path.join(process.cwd(), 'src/app/finance/pdc-cheque/cheques-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const landlordsFilePath = path.join(process.cwd(), 'src/app/landlord/landlords-data.json');
const tenancyContractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const leaseContractsFilePath = path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json');


async function readPdcCheques(): Promise<PdcCheque[]> {
    try {
        await fs.access(pdcChequesFilePath);
        const data = await fs.readFile(pdcChequesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writePdcCheques([]);
            return [];
        }
        throw error;
    }
}

async function writePdcCheques(data: PdcCheque[]) {
    await fs.writeFile(pdcChequesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getPdcCheques() {
    const cheques = await readPdcCheques();
    return cheques.sort((a,b) => new Date(b.chequeDate).getTime() - new Date(a.chequeDate).getTime());
}

export async function addPdcCheque(data: Omit<PdcCheque, 'id'>) {
    const validation = pdcChequeSchema.omit({ id: true }).safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allCheques = await readPdcCheques();
        const newCheque: PdcCheque = {
            ...validation.data,
            id: `CHQ-${Date.now()}`,
        };

        allCheques.push(newCheque);
        await writePdcCheques(allCheques);
        
        revalidatePath('/finance/pdc-cheque');
        return { success: true, data: newCheque };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function updatePdcChequeStatus(chequeId: string, status: PdcCheque['status'], date: string) {
    try {
        const allCheques = await readPdcCheques();
        const chequeIndex = allCheques.findIndex(c => c.id === chequeId);

        if (chequeIndex === -1) {
            return { success: false, error: 'Cheque not found.' };
        }

        allCheques[chequeIndex].status = status;
        if(status === 'Deposited') {
            allCheques[chequeIndex].depositDate = date;
        } else if (status === 'Cleared' || status === 'Bounced') {
            allCheques[chequeIndex].clearanceDate = date;
        }

        await writePdcCheques(allCheques);
        revalidatePath('/finance/pdc-cheque');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function deletePdcCheque(chequeId: string) {
    try {
        const allCheques = await readPdcCheques();
        const updatedCheques = allCheques.filter(c => c.id !== chequeId);

        if (allCheques.length === updatedCheques.length) {
            return { success: false, error: 'Cheque not found.' };
        }

        await writePdcCheques(updatedCheques);
        revalidatePath('/finance/pdc-cheque');
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

    const landlordMap = new Map<string, string>();
    landlords.forEach(l => landlordMap.set(l.landlordData.code, l.landlordData.name));

    return {
        tenants: tenants.map(t => ({ value: t.tenantData.name, label: t.tenantData.name, contractNo: t.tenantData.contractNo })),
        landlords: landlords.map(l => ({ value: l.landlordData.name, label: l.landlordData.name })),
        tenancyContracts: tenancyContracts.map(c => ({ value: c.contractNo, label: c.contractNo, property: c.property, partyName: c.tenantName, paymentSchedule: c.paymentSchedule })),
        leaseContracts: leaseContracts.map(c => ({ value: c.contractNo, label: c.contractNo, property: c.property, partyName: c.landlordCode ? (landlordMap.get(c.landlordCode) || c.landlordCode) : 'Unknown', paymentSchedule: c.paymentSchedule })),
    }
}

export async function getSummary() {
    const cheques = await readPdcCheques();
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

export async function returnPdcCheque(chequeIds: string[]) {
    try {
        const allCheques = await readPdcCheques();
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

        await writePdcCheques(updatedCheques);
        revalidatePath('/finance/pdc-cheque');
        return { success: true, count: updatedCount };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
