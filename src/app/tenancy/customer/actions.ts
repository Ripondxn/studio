
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { type Payment } from '@/app/finance/payment/schema';

const customersFilePath = path.join(process.cwd(), 'src/app/tenancy/customer/customers-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');


async function getCustomers() {
    try {
        await fs.access(customersFilePath);
        const data = await fs.readFile(customersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeCustomers([]);
            return [];
        }
        throw error;
    }
}

async function writeCustomers(data: any) {
    await fs.writeFile(customersFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getAllCustomers() {
    const customers = await getCustomers();
    return customers.map((c: any) => ({
        ...c.customerData,
        attachments: c.attachments || [],
    }));
}

export async function saveCustomerData(dataToSave: any, isNewRecord: boolean) {
  try {
    const allCustomers = await getCustomers();
    
    if (isNewRecord) {
        const { code } = dataToSave.customerData;
        const customerExists = allCustomers.some((c: any) => c.customerData.code === code);
        if (customerExists) {
            return { success: false, error: `Customer with code "${code}" already exists.` };
        }
        const newCustomer = {
            id: `C${Date.now()}`,
            ...dataToSave
        };
        allCustomers.push(newCustomer);
    } else {
        const { code } = dataToSave.customerData;
        const index = allCustomers.findIndex((c: any) => c.customerData.code === code);

        if (index !== -1) {
            allCustomers[index] = {
                ...allCustomers[index],
                ...dataToSave,
                id: allCustomers[index].id
            };
        } else {
            return { success: false, error: `Customer with code "${code}" not found.` };
        }
    }
    
    await writeCustomers(allCustomers);
    revalidatePath('/tenancy/customer');

    return { success: true };
  } catch (error) {
    console.error('Failed to save customer data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function findCustomerData(customerCode: string) {
  try {
    const allCustomers = await getCustomers();

    if (customerCode === 'new') {
        let maxNum = 0;
        allCustomers.forEach((c: any) => {
            const code = c.customerData.code || '';
            const match = code.match(/^C(\d{3,})$/);
            if(match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum) {
                    maxNum = num;
                }
            }
        });
        const newCode = `C${(maxNum + 1).toString().padStart(3, '0')}`;
        return { success: true, data: { customerData: { code: newCode } } };
    }

    const customer = allCustomers.find((c: any) => c.customerData.code === customerCode);

    if (customer) {
       return { success: true, data: customer };
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
        const allCustomers = await getCustomers();
        const updatedCustomers = allCustomers.filter((c: any) => c.customerData.code !== customerCode);

        if (allCustomers.length === updatedCustomers.length) {
            return { success: false, error: 'Customer not found.' };
        }

        await writeCustomers(updatedCustomers);
        revalidatePath('/tenancy/customer');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete customer data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

async function readPayments(): Promise<Payment[]> {
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

export async function getPaymentsForCustomer(customerCode: string): Promise<Payment[]> {
    try {
        const allPayments = await readPayments();
        const customerPayments = allPayments.filter(p => p.partyName === customerCode && p.type === 'Receipt');
        return customerPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error('Failed to get payments for customer:', error);
        return [];
    }
}
