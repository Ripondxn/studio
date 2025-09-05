
'use server';

import { revalidatePath } from 'next/cache';
import { firestoreAdmin } from '@/lib/firebase/admin-config';
import { type Payment } from '@/app/finance/payment/schema';

async function getNextCustomerCode() {
    const querySnapshot = await firestoreAdmin.collection("customers").get();
    let maxNum = 0;
    querySnapshot.docs.forEach(doc => {
        const code = doc.data().customerData.code || '';
        const match = code.match(/^C(\d+)$/);
        if(match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `C${(maxNum + 1).toString().padStart(4, '0')}`;
}

export async function getAllCustomers() {
    const querySnapshot = await firestoreAdmin.collection("customers").get();
    return querySnapshot.docs.map(doc => ({ ...doc.data().customerData, id: doc.id, attachments: doc.data().attachments || [] }));
}

export async function saveCustomerData(dataToSave: any, isNewRecord: boolean, isAutoCode: boolean) {
  try {
    let customerData = dataToSave.customerData;
    let savedCustomer;

    if (isNewRecord) {
        if (isAutoCode) {
            customerData.code = await getNextCustomerCode();
        }

        const { code } = customerData;
        const querySnapshot = await firestoreAdmin.collection("customers").where("customerData.code", "==", code).get();
        if (!querySnapshot.empty) {
            return { success: false, error: `Customer with code "${code}" already exists.` };
        }

        const docRef = await firestoreAdmin.collection("customers").add(dataToSave);
        savedCustomer = { ...dataToSave, id: docRef.id };
    } else {
        const { code } = customerData;
        const querySnapshot = await firestoreAdmin.collection("customers").where("customerData.code", "==", code).get();

        if (!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;
            await firestoreAdmin.collection("customers").doc(docId).update(dataToSave);
            savedCustomer = { ...dataToSave, id: docId };
        } else {
            return { success: false, error: `Customer with code "${code}" not found.` };
        }
    }

    revalidatePath('/tenancy/customer');
    return { success: true, data: savedCustomer.customerData };
  } catch (error) {
    console.error('Failed to save customer data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function findCustomerData(customerCode: string) {
  try {
    if (customerCode === 'new') {
        const newCode = await getNextCustomerCode();
        return { success: true, data: { customerData: { code: newCode } } };
    }

    const querySnapshot = await firestoreAdmin.collection("customers").where("customerData.code", "==", customerCode).get();

    if (!querySnapshot.empty) {
       const doc = querySnapshot.docs[0];
       return { success: true, data: { ...doc.data(), id: doc.id } };
    } else {
       return { success: false, error: "Not Found" };
    }
  } catch (error) {
    console.error('Failed to find customer data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function deleteCustomerData(customerCode: string) {
    try {
        const querySnapshot = await firestoreAdmin.collection("customers").where("customerData.code", "==", customerCode).get();

        if (querySnapshot.empty) {
            return { success: false, error: 'Customer not found.' };
        }

        const docId = querySnapshot.docs[0].id;
        await firestoreAdmin.collection("customers").doc(docId).delete();

        revalidatePath('/tenancy/customer');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete customer data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

export async function getPaymentsForCustomer(customerCode: string): Promise<Payment[]> {
    try {
        const querySnapshot = await firestoreAdmin.collection("payments").where("partyName", "==", customerCode).where("type", "==", "Receipt").get();
        const customerPayments = querySnapshot.docs.map(doc => doc.data() as Payment);
        return customerPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error('Failed to get payments for customer:', error);
        return [];
    }
}
