
'use server';

import { processDocument, type ProcessDocumentInput } from '@/ai/flows/process-document-flow';
import { getVendors } from '@/app/vendors/actions';
import { getAllTenants } from '@/app/tenancy/tenants/actions';
import { getAllCustomers } from '@/app/tenancy/customer/actions';
import { saveBill } from '../vendors/bill/actions';
import { saveInvoice } from '../tenancy/customer/invoice/actions';
import { type UserRole } from '../admin/user-roles/schema';
import { addPayment } from '../finance/payment/actions';

export async function extractDataFromDocument(input: ProcessDocumentInput) {
  try {
    const result = await processDocument(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error processing document:', error);
    return { success: false, error: 'Failed to process document with AI.' };
  }
}

export async function getPartyLookups() {
    const [vendors, tenants, customers] = await Promise.all([
        getVendors(),
        getAllTenants(),
        getAllCustomers(),
    ]);

    return {
        vendors: vendors.map((v: any) => ({ value: v.code, label: v.name })),
        tenants: tenants.map((t: any) => ({ value: t.code, label: t.name })),
        customers: customers.map((c: any) => ({ value: c.code, label: c.name })),
    };
}


export async function createBillFromDocument(data: any, currentUser: UserRole) {
    try {
        const result = await saveBill(data, true);
        if (!result.success) {
            throw new Error(result.error);
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function createInvoiceFromDocument(data: any, currentUser: {name: string}) {
     try {
        const result = await saveInvoice(data, currentUser.name);
        if (!result.success) {
            throw new Error(result.error);
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function createReceiptFromDocument(data: any, currentUser: {name: string}) {
    try {
        const result = await addPayment(data);
         if (!result.success) {
            throw new Error(result.error);
        }
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message };
    }
}
