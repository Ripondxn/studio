
'use server';

import { revalidatePath } from 'next/cache';
import { firestoreAdmin } from '@/lib/firebase/admin-config';
import { invoiceSchema, type Invoice } from './schema';

async function getNextInvoiceNumber(prefix: string) {
    const querySnapshot = await firestoreAdmin.collection("invoices").where("invoiceNo", ">=", prefix).where("invoiceNo", "<", prefix + 'z').get();
    let maxNum = 0;
    querySnapshot.docs.forEach(doc => {
        const match = doc.data().invoiceNo.match(new RegExp(`^${prefix}-(\\d+)$`));
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `${prefix}-${(maxNum + 1).toString().padStart(4, '0')}`;
}

export async function getInvoicesForCustomer(customerCode: string) {
    const querySnapshot = await firestoreAdmin.collection("invoices").where("customerCode", "==", customerCode).get();
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as Invoice;
        return { ...data, id: doc.id, remainingBalance: data.total - (data.amountPaid || 0) };
    });
}

export async function getNextGeneralInvoiceNumber() {
    return await getNextInvoiceNumber('INV');
}

export async function getNextSubscriptionInvoiceNumber() {
    return await getNextInvoiceNumber('SUB-INV');
}

export async function saveInvoice(data: Omit<Invoice, 'amountPaid' | 'remainingBalance'> & { isAutoInvoiceNo?: boolean, isSubscription?: boolean }, createdBy: string) {
    const { isAutoInvoiceNo, isSubscription, ...invoiceData } = data;
    const validation = invoiceSchema.omit({id: true, amountPaid: true, remainingBalance: true}).safeParse(invoiceData);

    if (!validation.success) {
        console.error("Invoice Validation Error:", validation.error.format());
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const isNewRecord = !data.id;
        const validatedData = validation.data;
        let savedInvoice: Invoice;

        if (isNewRecord) {
            let newInvoiceNo = validatedData.invoiceNo;
            if (isAutoInvoiceNo) {
                newInvoiceNo = isSubscription ? await getNextSubscriptionInvoiceNumber() : await getNextGeneralInvoiceNumber();
            } else {
                const querySnapshot = await firestoreAdmin.collection("invoices").where("invoiceNo", "==", newInvoiceNo).get();
                if (!querySnapshot.empty) {
                    return { success: false, error: `An invoice with number "${newInvoiceNo}" already exists.`};
                }
            }

            const newInvoice: Invoice = {
                ...validatedData,
                invoiceNo: newInvoiceNo,
                amountPaid: 0,
                items: validatedData.items.map(item => ({...item, id: item.id || `item-${Date.now()}-${Math.random()}`})),
                id: ''
            };
            const docRef = await firestoreAdmin.collection("invoices").add(newInvoice);
            savedInvoice = { ...newInvoice, id: docRef.id };
            
        } else {
            const docRef = firestoreAdmin.collection("invoices").doc(data.id as string);
            await docRef.update(validatedData);
            const updatedDoc = await docRef.get();
            savedInvoice = { ...updatedDoc.data(), id: updatedDoc.id } as Invoice;
        }

        revalidatePath(`/tenancy/customer/add?code=${data.customerCode}`);
        revalidatePath(`/tenancy/tenants/add?code=${data.customerCode}`);
        return { success: true, data: savedInvoice };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function saveSubscriptionInvoice(data: Omit<Invoice, 'amountPaid' | 'remainingBalance'> & { isAutoInvoiceNo?: boolean }, createdBy: string) {
    return await saveInvoice({ ...data, isSubscription: true }, createdBy);
}


export async function deleteInvoice(invoiceId: string) {
    try {
        const docRef = firestoreAdmin.collection("invoices").doc(invoiceId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return { success: false, error: 'Invoice not found.' };
        }
        const customerCode = doc.data()?.customerCode;
        await docRef.delete();
        revalidatePath(`/tenancy/customer/add?code=${customerCode}`);
        revalidatePath(`/tenancy/tenants/add?code=${customerCode}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function updateInvoiceStatus(invoiceId: string, status: Invoice['status']) {
    try {
        const docRef = firestoreAdmin.collection("invoices").doc(invoiceId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return { success: false, error: 'Invoice not found to update status.' };
        }
        await docRef.update({ status });
        revalidatePath(`/tenancy/customer/add?code=${doc.data()?.customerCode}`);
        revalidatePath(`/tenancy/tenants/add?code=${doc.data()?.customerCode}`);
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

export async function applyPaymentToInvoices(invoicePayments: { invoiceId: string; amount: number }[], customerCode: string) {
    try {
        const batch = firestoreAdmin.batch();
        for (const payment of invoicePayments) {
            const docRef = firestoreAdmin.collection("invoices").doc(payment.invoiceId);
            const doc = await docRef.get();
            if (doc.exists) {
                const invoice = doc.data() as Invoice;
                const newAmountPaid = (invoice.amountPaid || 0) + payment.amount;
                const remainingBalance = invoice.total - newAmountPaid;
                const newStatus = remainingBalance <= 0.001 ? 'Paid' : invoice.status;
                batch.update(docRef, { amountPaid: newAmountPaid, status: newStatus });
            }
        }
        await batch.commit();

        revalidatePath(`/tenancy/customer/add?code=${customerCode}`);
        revalidatePath(`/tenancy/tenants/add?code=${customerCode}`);
        return { success: true };
    } catch (error) {
         return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
