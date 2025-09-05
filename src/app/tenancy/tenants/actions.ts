
'use server';

// import { firestoreAdmin } from '@/lib/firebase/admin-config';
import { revalidatePath } from 'next/cache';
import { type Contract } from '../contract/schema';
import { type Unit } from '@/app/property/units/schema';
import { type Room } from '@/app/property/rooms/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { type Invoice } from '@/app/tenancy/customer/invoice/schema';
import { getUnits } from '@/app/property/units/actions';
import { getRooms } from '@/app/property/rooms/actions';

async function getTenants() {
    // const tenantsCollection = firestoreAdmin.collection('tenants');
    // const snapshot = await tenantsCollection.get();
    // return snapshot.docs.map(doc => doc.data());
    return [];
}

async function getContracts(): Promise<Contract[]> {
    // const contractsCollection = firestoreAdmin.collection('contracts');
    // const snapshot = await contractsCollection.get();
    // return snapshot.docs.map(doc => doc.data() as Contract);
    return [];
}

async function getInvoices(): Promise<Invoice[]> {
    // const invoicesCollection = firestoreAdmin.collection('invoices');
    // const snapshot = await invoicesCollection.get();
    // return snapshot.docs.map(doc => doc.data() as Invoice);
    return [];
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
    // const allTenants:any = await getTenants();
    // let maxNum = 0;
    // allTenants.forEach((t: any) => {
    //     const code = t.tenantData.code || '';
    //     const match = code.match(/^T(\d+)$/);
    //     if(match) {
    //         const num = parseInt(match[1], 10);
    //         if (num > maxNum) {
    //             maxNum = num;
    //         }
    //     }
    // });
    return `T0001`;
}

export async function saveTenantData(dataToSave: any, isNewRecord: boolean, isAutoCode: boolean) {
    return { success: true, data: {} };
}

export async function findTenantData(tenantCode: string) {
    return { success: true, data: { tenantData: { code: 'new' } } };
}

export async function deleteTenantData(tenantCode: string) {
    return { success: true };
}

export async function cancelSubscription(tenantCode: string) {
    return { success: true };
}

export async function saveSubscriptionSettings(tenantCode: string, settings: Partial<Tenant>) {
    return { success: true };
}
