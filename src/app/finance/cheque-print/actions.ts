
'use server';

import { promises as fs } from 'fs';
import path from 'path';

async function readData(filePath: string) {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export async function getPayeeLookups() {
    const tenants = await readData(path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json'));
    const landlords = await readData(path.join(process.cwd(), 'src/app/landlord/landlords-data.json'));
    const vendors = await readData(path.join(process.cwd(), 'src/app/vendors/vendors-data.json'));
    const customers = await readData(path.join(process.cwd(), 'src/app/tenancy/customer/customers-data.json'));
    const agents = await readData(path.join(process.cwd(), 'src/app/vendors/agents/agents-data.json'));

    const allPayees = [
        ...tenants.map((t: any) => ({ value: t.tenantData.name, label: `${t.tenantData.name} (Tenant)` })),
        ...landlords.map((l: any) => ({ value: l.landlordData.name, label: `${l.landlordData.name} (Landlord)` })),
        ...vendors.map((v: any) => ({ value: v.vendorData.name, label: `${v.vendorData.name} (Vendor)` })),
        ...customers.map((c: any) => ({ value: c.customerData.name, label: `${c.customerData.name} (Customer)` })),
        ...agents.map((a: any) => ({ value: a.name, label: `${a.name} (Agent)` })),
    ];
    
    // Remove duplicates
    const uniquePayees = Array.from(new Map(allPayees.map(item => [item.value, item])).values());

    return {
        payees: uniquePayees.sort((a,b) => a.label.localeCompare(b.label)),
    }
}
