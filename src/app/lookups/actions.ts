
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { type Landlord } from '@/app/landlord/schema';
import { type Vendor } from '@/app/vendors/schema';
import { type Agent } from '@/app/vendors/agents/schema';
import { type Customer } from '@/app/tenancy/customer/schema';
import { type BankAccount } from '@/app/finance/banking/schema';
import { type Property } from '@/app/property/properties/list/schema';
import { type Unit } from '@/app/property/units/schema';
import { type Room } from '@/app/property/rooms/schema';
import { type Partition } from '@/app/property/partitions/schema';
import { type ReceiptBook } from '@/app/finance/book-management/schema';
import { type Product } from '@/app/products/schema';
import { type MaintenanceTicket } from '@/app/maintenance/ticket-issue/schema';
import { type Account } from '@/app/finance/chart-of-accounts/schema';


async function readData<T>(filePath: string, defaultValue: T[] = []): Promise<T[]> {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
            return defaultValue;
        }
        throw error;
    }
}

export async function getExpenseAccounts(): Promise<{ value: string; label: string }[]> {
    const accounts: Account[] = await readData(path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json'));
    return accounts
        .filter(acc => acc.type === 'Expense' && !acc.isGroup)
        .map(acc => ({ value: acc.code, label: `${acc.name} (${acc.code})` }));
}

export async function getLookups() {
    const tenantsData: {tenantData: Tenant}[] = await readData(path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json'));
    const landlordsData: {landlordData: Landlord}[] = await readData(path.join(process.cwd(), 'src/app/landlord/landlords-data.json'));
    const vendorsData: {vendorData: Vendor}[] = await readData(path.join(process.cwd(), 'src/app/vendors/vendors-data.json'));
    const agentsData: Agent[] = await readData(path.join(process.cwd(), 'src/app/vendors/agents/agents-data.json'));
    const customersData: {customerData: Customer}[] = await readData(path.join(process.cwd(), 'src/app/tenancy/customer/customers-data.json'));
    const bankAccountsData: BankAccount[] = await readData(path.join(process.cwd(), 'src/app/finance/banking/accounts-data.json'));
    const usersData: any[] = await readData(path.join(process.cwd(), 'src/app/admin/user-roles/users.json'));
    const receiptBooksData: ReceiptBook[] = await readData(path.join(process.cwd(), 'src/app/finance/book-management/receipt-books-data.json'));
    const propertiesData: {propertyData: Property}[] = await readData(path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json'));
    const unitsData: Unit[] = await readData(path.join(process.cwd(), 'src/app/property/units/units-data.json'));
    const roomsData: Room[] = await readData(path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json'));
    const productsData: Product[] = await readData(path.join(process.cwd(), 'src/app/products/products-data.json'));
    const maintenanceTicketsData: MaintenanceTicket[] = await readData(path.join(process.cwd(), 'src/app/maintenance/ticket-issue/tickets-data.json'));

    return {
        tenants: tenantsData.map(t => ({ value: t.tenantData.code, label: t.tenantData.name })),
        landlords: landlordsData.map(l => ({ value: l.landlordData.code, label: l.landlordData.name })),
        vendors: vendorsData.map(v => ({ value: v.vendorData.code, label: v.vendorData.name })),
        agents: agentsData.map(a => ({ value: a.code, label: a.name })),
        customers: customersData.map(c => ({ value: c.customerData.code, label: c.customerData.name })),
        bankAccounts: bankAccountsData.map(b => ({ value: b.id, label: `${b.accountName} (${b.bankName})`})),
        users: usersData.map((u: any) => ({ value: u.name, label: u.name })),
        receiptBooks: receiptBooksData,
        properties: propertiesData.map(p => ({ value: p.propertyData.code, label: p.propertyData.name })),
        units: unitsData.map(u => ({ value: u.unitCode, label: u.unitCode, propertyCode: u.propertyCode })),
        rooms: roomsData.map(r => ({ value: r.roomCode, label: r.roomCode, propertyCode: r.propertyCode, unitCode: r.unitCode })),
        products: productsData,
        maintenanceTickets: maintenanceTicketsData
            .filter(t => t.status !== 'Completed' && t.status !== 'Cancelled')
            .map(t => ({ value: t.id, label: `${t.ticketNo} - ${t.issueType}` })),
    }
}
