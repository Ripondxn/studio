
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { bankAccountSchema, type BankAccount } from './schema';
import { type Payment, paymentSchema } from '../payment/schema';
import { type Cheque } from '../cheque-deposit/schema';


const accountsFilePath = path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const pettyCashFilePath = path.join(process.cwd(), 'src/app/finance/banking/petty-cash.json');
const chequesFilePath = path.join(process.cwd(), 'src/app/finance/cheque-deposit/cheques-data.json');


async function readAccounts(): Promise<BankAccount[]> {
    try {
        await fs.access(accountsFilePath);
        const data = await fs.readFile(accountsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeAccounts([]);
            return [];
        }
        throw error;
    }
}

async function writeAccounts(data: BankAccount[]) {
    await fs.writeFile(accountsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function readPettyCash() {
    try {
        await fs.access(pettyCashFilePath);
        const data = await fs.readFile(pettyCashFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { balance: 0 };
        }
        throw error;
    }
}

export async function writePettyCash(data: { balance: number }) {
    await fs.writeFile(pettyCashFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getBankAccounts() {
    const storedAccounts = await readAccounts();
    const pettyCashData = await readPettyCash();
    const pettyCashAccount: BankAccount = {
        id: "acc_3",
        accountName: "Petty Cash",
        bankName: "Cash on Hand",
        accountNumber: "N/A",
        balance: pettyCashData.balance,
        currency: "AED",
    };
    return [pettyCashAccount, ...storedAccounts];
}


const formSchema = bankAccountSchema.omit({ id: true });

export async function saveBankAccount(data: z.infer<typeof bankAccountSchema>, isNew: boolean) {
    const validation = bankAccountSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allAccounts = await readAccounts();
        
        if (isNew) {
            const newAccount: BankAccount = {
                ...validation.data,
                id: `acc_${Date.now()}`,
            };
            allAccounts.push(newAccount);
        } else {
            const index = allAccounts.findIndex(acc => acc.id === data.id);
            if (index === -1) {
                return { success: false, error: 'Account not found.' };
            }
            allAccounts[index] = validation.data;
        }

        await writeAccounts(allAccounts);
        revalidatePath('/finance/banking');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function deleteBankAccount(accountId: string) {
     if (accountId === 'acc_3') {
        return { success: false, error: 'The Petty Cash account cannot be deleted.' };
     }
     try {
        const allAccounts = await readAccounts();
        const updatedAccounts = allAccounts.filter(acc => acc.id !== accountId);
        
        if (allAccounts.length === updatedAccounts.length) {
            return { success: false, error: 'Account not found.' };
        }

        await writeAccounts(updatedAccounts);
        revalidatePath('/finance/banking');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

async function readAllPayments(): Promise<Payment[]> {
    try {
        const paymentsData = await fs.readFile(paymentsFilePath, 'utf-8');
        return JSON.parse(paymentsData);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error('Failed to read payments file:', error);
        return [];
    }
}

async function writePayments(data: Payment[]) {
    await fs.writeFile(paymentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


async function readAllCheques(): Promise<Cheque[]> {
    try {
        const chequesData = await fs.readFile(chequesFilePath, 'utf-8');
        return JSON.parse(chequesData);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error('Failed to read cheques file:', error);
        return [];
    }
}


export async function getAllTransactions(): Promise<Payment[]> {
    const payments = await readAllPayments();
    const cheques = await readAllCheques();

    const chequeTransactions: Payment[] = cheques
        .filter(c => c.status === 'Cleared' && c.clearanceDate)
        .map(c => ({
            id: c.id,
            type: c.type === 'Incoming' ? 'Receipt' : 'Payment',
            date: c.clearanceDate!,
            partyType: c.type === 'Incoming' ? 'Tenant' : 'Landlord',
            partyName: c.partyName,
            amount: c.amount,
            paymentMethod: 'Cheque',
            bankAccountId: c.bankAccountId,
            referenceNo: c.chequeNo,
            property: c.property,
            status: c.type === 'Incoming' ? 'Received' : 'Paid',
            remarks: `Cleared cheque from ${c.bankName}`
        }));
    
    const allTransactions = [...payments, ...chequeTransactions].filter(p => p.currentStatus === 'POSTED');

    return allTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getTransactionsForAccount(accountId: string): Promise<Payment[]> {
     try {
        const allTransactions = await getAllTransactions();
        
        const accountPayments = allTransactions.filter((p: Payment) => {
             if (accountId === 'acc_3') {
                return p.paymentFrom === 'Petty Cash';
            }
            return p.bankAccountId === accountId
        });

        return accountPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error('Failed to read payments file:', error);
        return [];
    }
}

const fundTransferSchema = z.object({
    fromAccountId: z.string().min(1, "From account is required."),
    toAccountId: z.string().min(1, "To account is required."),
    amount: z.number().min(0.01, "Amount must be positive."),
    date: z.string().min(1, "Date is required."),
    remarks: z.string().optional(),
});


export async function transferFunds(data: z.infer<typeof fundTransferSchema>) {
    const validation = fundTransferSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    const { fromAccountId, toAccountId, amount, date, remarks } = validation.data;

    if (fromAccountId === toAccountId) {
        return { success: false, error: "From and To accounts cannot be the same." };
    }
    
    try {
        const allAccounts = await readAccounts();
        let pettyCash = await readPettyCash();
        
        const fromAccount = fromAccountId === 'acc_3' ? { ...pettyCash, id: 'acc_3', accountName: 'Petty Cash' } : allAccounts.find(acc => acc.id === fromAccountId);
        const toAccount = toAccountId === 'acc_3' ? { ...pettyCash, id: 'acc_3', accountName: 'Petty Cash' } : allAccounts.find(acc => acc.id === toAccountId);

        if (!fromAccount || !toAccount) {
            return { success: false, error: "One or both accounts not found." };
        }
        
        // Check balance
        if(fromAccount.balance < amount) {
             return { success: false, error: `Insufficient funds in ${fromAccount.accountName}.` };
        }

        // Perform transfer
        // Debit from account
        if (fromAccountId === 'acc_3') {
            pettyCash.balance -= amount;
        } else {
            const fromIndex = allAccounts.findIndex(acc => acc.id === fromAccountId);
            allAccounts[fromIndex].balance -= amount;
        }
        
        // Credit to account
        if (toAccountId === 'acc_3') {
            pettyCash.balance += amount;
        } else {
            const toIndex = allAccounts.findIndex(acc => acc.id === toAccountId);
            allAccounts[toIndex].balance += amount;
        }
        
        await writeAccounts(allAccounts);
        await writePettyCash(pettyCash);
        
        // Log the transaction
        const allPayments = await readAllPayments();
        const referenceNo = `TRF-${Date.now()}`;
        
        // Payment from source
        const paymentRecord: Payment = {
            id: `PAY-${Date.now()}-OUT`,
            type: 'Payment',
            date: date,
            partyType: 'Vendor', // Internal Transfer
            partyName: `Transfer to ${toAccount.accountName}`,
            amount: amount,
            paymentMethod: fromAccountId === 'acc_3' ? 'Cash' : 'Bank Transfer',
            bankAccountId: fromAccountId,
            referenceNo,
            remarks,
            status: 'Paid',
            currentStatus: 'POSTED',
        };

        // Receipt to destination
         const receiptRecord: Payment = {
            id: `PAY-${Date.now()}-IN`,
            type: 'Receipt',
            date: date,
            partyType: 'Customer', // Internal Transfer
            partyName: `Transfer from ${fromAccount.accountName}`,
            amount: amount,
            paymentMethod: toAccountId === 'acc_3' ? 'Cash' : 'Bank Transfer',
            bankAccountId: toAccountId,
            referenceNo,
            remarks,
            status: 'Received',
            currentStatus: 'POSTED',
        };
        
        allPayments.push(paymentRecord, receiptRecord);
        await writePayments(allPayments);

        revalidatePath('/finance/banking');
        revalidatePath('/workflow');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
