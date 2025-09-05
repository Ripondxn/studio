'use server';

import { promises as fs } from 'fs';
import path from 'path';

const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const landlordsFilePath = path.join(process.cwd(), 'src/app/landlords/landlords-data.json');
const vendorsFilePath = path.join(process.cwd(), 'src/app/purchasing/vendors/vendors-data.json');
const agentsFilePath = path.join(process.cwd(), 'src/app/agents/agents-data.json');
const customersFilePath = path.join(process.cwd(), 'src/app/crm/customers/customers-data.json');
const tenancyContractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const leaseContractsFilePath = path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json');
const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');
const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');

async function readFileData(filePath: string) {
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

export async function getLookups() {
    const [tenants, landlords, vendors, agents, customers, tenancyContracts, leaseContracts, units, rooms] = await Promise.all([
        readFileData(tenantsFilePath),
        readFileData(landlordsFilePath),
        readFileData(vendorsFilePath),
        readFileData(agentsFilePath),
        readFileData(customersFilePath),
        readFileData(tenancyContractsFilePath),
        readFileData(leaseContractsFilePath),
        readFileData(unitsFilePath),
        readFileData(roomsFilePath),
    ]);

    return {
        tenants: tenants.map((t: any) => ({ value: t.id, label: t.name, contractNo: t.contractNo })),
        landlords: landlords.map((l: any) => ({ value: l.id, label: l.name })),
        vendors: vendors.map((v: any) => ({ value: v.id, label: v.vendorName })),
        agents: agents.map((a: any) => ({ value: a.id, label: a.name })),
        customers: customers.map((c: any) => ({ value: c.id, label: c.name })),
        tenancyContracts: tenancyContracts.map((c: any) => ({ value: c.contractNo, label: c.contractNo, property: c.property, unitCode: c.unitCode, roomCode: c.roomCode, partyName: c.tenantName, paymentSchedule: c.paymentSchedule })),
        leaseContracts: leaseContracts.map((c: any) => ({ value: c.contractNo, label: c.contractNo, property: c.property, unitCode: c.unitCode, roomCode: c.roomCode, partyName: c.landlordName, paymentSchedule: c.paymentSchedule })),
        units: units.map((u: any) => ({ value: u.unitCode, label: u.unitCode, propertyCode: u.propertyCode })),
        rooms: rooms.map((r: any) => ({ value: r.roomCode, label: r.roomCode, unitCode: r.unitCode, propertyCode: r.propertyCode }))
    };
}
