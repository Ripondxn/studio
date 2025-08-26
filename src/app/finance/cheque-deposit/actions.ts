
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
import { startOfWeek, endOfWeek, startOfMonth, isWithinInterval, parseISO, isBefore, startOfToday, format } from 'date-fns';
import { type BankAccount } from '../banking/schema';
import { type Payment } from '../payment/schema';
import { type UserRole } from '@/app/admin/user-roles/schema';

const chequesFilePath = path.join(process.cwd(), 'src/app/finance/cheque-deposit/cheques-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const landlordsFilePath = path.join(process.cwd(), 'src/app/landlord/landlords-data.json');
const tenancyContractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const leaseContractsFilePath = path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json');
const bankAccountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');


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

export async function getBankAccounts(): Promise<BankAccount[]> {
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


export async function getCheques() {
    const cheques = await readCheques();
    return cheques.sort((a,b) => new Date(b.chequeDate).getTime() - new Date(a.date).getTime());
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


export async function updateChequeStatus(chequeId: string, status: Cheque['status'], date: string, user: { email: string, name: string, role: string }, bankAccountId?: string) {
    try {
        const allCheques = await readCheques();
        const allPayments = await readPayments();

        const chequeIndex = allCheques.findIndex(c => c.id === chequeId);

        if (chequeIndex === -1) {
            return { success: false, error: 'Cheque not found.' };
        }
        
        const originalCheque = allCheques[chequeIndex];
        const updatedCheque = { ...originalCheque, status, bankAccountId };
        
        if(status === 'Deposited' && bankAccountId) {
            updatedCheque.depositDate = date;
        } else if (status === 'Cleared' && bankAccountId) {
            updatedCheque.clearanceDate = date;
        } else if (status === 'Bounced') {
            updatedCheque.clearanceDate = date;
        }

        allCheques[chequeIndex] = updatedCheque;
        
        if (status === 'Cleared') {
            if (!bankAccountId) {
                 return { success: false, error: 'Bank account is required to clear a cheque.' };
            }
            
            const paymentType = originalCheque.type === 'Incoming' ? 'Receipt' : 'Payment';
            const remarks = `Cleared Cheque: ${originalCheque.chequeNo}`;
            
            const newPayment: Payment = {
                id: `PAY-${Date.now()}`,
                type: paymentType,
                date: date,
                partyType: originalCheque.type === 'Incoming' ? 'Tenant' : 'Landlord',
                partyName: originalCheque.partyName,
                amount: originalCheque.amount,
                paymentMethod: 'Cheque',
                bankAccountId: bankAccountId,
                paymentFrom: 'Bank',
                referenceNo: originalCheque.chequeNo,
                property: originalCheque.property,
                status: paymentType === 'Receipt' ? 'Received' : 'Paid',
                currentStatus: 'PENDING_ADMIN_APPROVAL',
                createdByUser: user.name,
                remarks,
                approvalHistory: [{
                    action: 'Created & Submitted',
                    actorId: user.email,
                    actorRole: user.role,
                    timestamp: new Date().toISOString(),
                    comments: `Status updated to ${status}`
                }]
            };
            allPayments.push(newPayment);
            await writePayments(allPayments);
            revalidatePath('/workflow');
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

export async function createDepositVoucher(
  chequeIds: string[],
  depositDate: string,
  bankAccountId: string,
  user: { email: string; name: string; role: string }
) {
  try {
    const allCheques = await readCheques();
    const allPayments = await fs.readFile(paymentsFilePath, 'utf-8').then(JSON.parse).catch(() => []);

    const selectedCheques = allCheques.filter(c => chequeIds.includes(c.id) && c.status === 'In Hand');

    if (selectedCheques.length === 0) {
      return { success: false, error: "No valid 'In Hand' cheques were selected." };
    }

    const totalAmount = selectedCheques.reduce((sum, c) => sum + c.amount, 0);
    const chequeNumbers = selectedCheques.map(c => c.chequeNo).join(', ');

    const newPayment: Payment = {
      id: `PAY-${Date.now()}`,
      type: 'Receipt',
      date: depositDate,
      partyType: 'Customer', // Simplified for deposit voucher
      partyName: `Cheque Deposit - ${depositDate}`,
      amount: totalAmount,
      paymentMethod: 'Cheque',
      paymentFrom: 'Bank',
      bankAccountId: bankAccountId,
      referenceNo: `DEP-${Date.now()}`,
      description: `Deposit of ${selectedCheques.length} cheques: ${chequeNumbers}`,
      remarks: `Cheque IDs: ${chequeIds.join(', ')}`,
      status: 'Received', // Final status upon posting
      createdByUser: user.name,
      currentStatus: 'PENDING_ADMIN_APPROVAL', // Start of workflow
      approvalHistory: [
        {
          action: 'Created & Submitted',
          actorId: user.email,
          actorRole: user.role,
          timestamp: new Date().toISOString(),
          comments: 'Cheque deposit voucher created.',
        },
      ],
    };

    allPayments.push(newPayment);
    await fs.writeFile(paymentsFilePath, JSON.stringify(allPayments, null, 2), 'utf-8');

    // Mark cheques as pending deposit
    const updatedCheques = allCheques.map(cheque => {
      if (chequeIds.includes(cheque.id)) {
        return {
          ...cheque,
          status: 'Deposited' as const,
          depositDate,
          bankAccountId,
        };
      }
      return cheque;
    });

    await writeCheques(updatedCheques);

    revalidatePath('/finance/cheque-deposit');
    revalidatePath('/workflow');
    return { success: true, count: selectedCheques.length };

  } catch (error) {
    return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
  }
}

interface ReturnChequeParams {
    chequeIds: string[];
    returnWithCash: boolean;
    paymentDetails?: {
        paymentFrom: 'Petty Cash' | 'Bank';
        bankAccountId?: string;
        user: { email: string, name: string, role: UserRole['role'] };
    }
}

export async function returnCheque({ chequeIds, returnWithCash, paymentDetails }: ReturnChequeParams) {
    try {
        const allCheques = await readCheques();
        const allPayments = await readPayments();
        let updatedCount = 0;
        const newStatus = returnWithCash ? 'Returned with Cash' : 'Returned';

        const selectedCheques = allCheques.filter(c => chequeIds.includes(c.id) && c.status === 'In Hand');

        if (selectedCheques.length === 0) {
            return { success: false, error: "No valid 'In Hand' cheques were selected to return." };
        }

        const updatedCheques = allCheques.map(cheque => {
            if (chequeIds.includes(cheque.id) && cheque.status === 'In Hand') {
                updatedCount++;
                return {
                    ...cheque,
                    status: newStatus,
                };
            }
            return cheque;
        });

        if (returnWithCash && paymentDetails) {
            for (const cheque of selectedCheques) {
                 const newPayment: Payment = {
                    id: `PAY-${Date.now()}-${cheque.id}`,
                    type: 'Payment',
                    date: format(new Date(), 'yyyy-MM-dd'),
                    partyType: 'Tenant', // Assuming return is always to tenant
                    partyName: cheque.partyName,
                    amount: cheque.amount,
                    paymentMethod: 'Cash',
                    paymentFrom: paymentDetails.paymentFrom,
                    bankAccountId: paymentDetails.bankAccountId,
                    referenceNo: `RTRN-${cheque.chequeNo}`,
                    description: `Cash return for Cheque #${cheque.chequeNo}`,
                    remarks: `Cheque returned with cash settlement.`,
                    status: 'Paid',
                    createdByUser: paymentDetails.user.name,
                    currentStatus: 'PENDING_ADMIN_APPROVAL',
                    approvalHistory: [{
                        action: 'Created & Submitted',
                        actorId: paymentDetails.user.email,
                        actorRole: paymentDetails.user.role,
                        timestamp: new Date().toISOString(),
                        comments: 'Cheque returned with cash payment.',
                    }],
                };
                allPayments.push(newPayment);
            }
            await writePayments(allPayments);
            revalidatePath('/workflow');
        }

        await writeCheques(updatedCheques);
        revalidatePath('/finance/cheque-deposit');
        return { success: true, count: updatedCount };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

    