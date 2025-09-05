
'use server';

import { firestoreAdmin } from '@/lib/firebase/admin-config';
import { revalidatePath } from 'next/cache';
import { type Contract } from '../contract/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { type Invoice } from '@/app/tenancy/customer/invoice/schema';

async function getTenants() {
    const tenantsCollection = firestoreAdmin.collection('tenants');
    const snapshot = await tenantsCollection.get();
    return snapshot.docs.map(doc => doc.data());
}

async function getContracts(): Promise<Contract[]> {
    const contractsCollection = firestoreAdmin.collection('contracts');
    const snapshot = await contractsCollection.get();
    return snapshot.docs.map(doc => doc.data() as Contract);
}

async function getInvoices(): Promise<Invoice[]> {
    const invoicesCollection = firestoreAdmin.collection('invoices');
    const snapshot = await invoicesCollection.get();
    return snapshot.docs.map(doc => doc.data() as Invoice);
}

export async function getAllTenants() {
    const tenants:any = await getTenants();
    const contracts = await getContracts();
    const invoices = await getInvoices();
    
    const contractsByTenantCode = new Map<string, Contract>();
    for (const contract of contracts) {
        if(contract.tenantCode) {
             if (!contractsByTenantCode.has(contract.tenantCode) || new Date(contract.endDate) > new Date(contractsByTenantCode.get(contract.tenantCode)!.endDate)) {
                contractsByTenantCode.set(contract.tenantCode, contract);
            }
        }
    }

    const invoiceStatsByCustomer = new Map<string, { totalBilled: number, totalPaid: number }>();
    for (const invoice of invoices) {
        if (invoice.status !== 'Cancelled') {
            if (!invoiceStatsByCustomer.has(invoice.customerCode)) {
                invoiceStatsByCustomer.set(invoice.customerCode, { totalBilled: 0, totalPaid: 0 });
            }
            const stats = invoiceStatsByCustomer.get(invoice.customerCode)!;
            stats.totalBilled += invoice.total;
            stats.totalPaid += invoice.amountPaid || 0;
        }
    }

    return tenants
        .filter((l: any) => l.tenantData && l.tenantData.code)
        .map((l: any) => {
            const tenantCode = l.tenantData.code;
            const contract = contractsByTenantCode.get(tenantCode);
            let dueBalance = 0;
            let contractValue = 0;
            let paidAmount = 0;

            if (l.tenantData.isSubscriptionActive) {
                const stats = invoiceStatsByCustomer.get(tenantCode) || { totalBilled: 0, totalPaid: 0 };
                contractValue = stats.totalBilled;
                paidAmount = stats.totalPaid;
                dueBalance = contractValue - paidAmount;
            } else if (contract) {
                contractValue = contract.totalRent;
                const paidInstallments = contract.paymentSchedule.filter(p => p.status === 'paid');
                paidAmount = paidInstallments.reduce((sum, p) => sum + p.amount, 0);
                dueBalance = contractValue - paidAmount;
            }

            return {
                ...l.tenantData,
                attachments: l.attachments || [],
                contractId: contract?.id || null,
                contractNo: contract?.contractNo || null,
                isSubscriptionActive: l.tenantData.isSubscriptionActive || false,
                contractValue,
                paidAmount,
                dueBalance,
            }
        });
}

async function getNextTenantCode() {
    const allTenants:any = await getTenants();
    let maxNum = 0;
    allTenants.forEach((t: any) => {
        const code = t.tenantData.code || '';
        const match = code.match(/^T(\d+)$/);
        if(match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    const nextNum = maxNum + 1;
    return `T${nextNum.toString().padStart(4, '0')}`;
}

export async function saveTenantData(dataToSave: any, isNewRecord: boolean, isAutoCode: boolean) {
    try {
        const { attachments, ...tenantData } = dataToSave;
        let tenantCode = tenantData.code;
        if (isNewRecord && isAutoCode) {
            tenantCode = await getNextTenantCode();
            tenantData.code = tenantCode;
        }

        const docRef = firestoreAdmin.collection('tenants').doc(tenantCode);

        const dataForDb = { tenantData, attachments };

        if (isNewRecord) {
            await docRef.set(dataForDb);
        } else {
            await docRef.update(dataForDb);
        }

        revalidatePath('/tenancy/tenants');
        return { success: true, data: dataForDb };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function findTenantData(tenantCode: string) {
    try {
        const docRef = firestoreAdmin.collection('tenants').doc(tenantCode);
        const doc = await docRef.get();

        if (doc.exists) {
            return { success: true, data: doc.data() };
        } else {
            return { success: false, error: 'Tenant not found' };
        }
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteTenantData(tenantCode: string) {
    try {
        const docRef = firestoreAdmin.collection('tenants').doc(tenantCode);
        await docRef.delete();

        revalidatePath('/tenancy/tenants');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function cancelSubscription(tenantCode: string) {
    try {
        const docRef = firestoreAdmin.collection('tenants').doc(tenantCode);
        await docRef.update({ 'tenantData.isSubscriptionActive': false });

        revalidatePath('/tenancy/tenants');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveSubscriptionSettings(tenantCode: string, settings: Partial<Tenant>) {
    try {
        const docRef = firestoreAdmin.collection('tenants').doc(tenantCode);
        await docRef.update({ 'tenantData.subscription': settings });

        revalidatePath('/tenancy/tenants');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
