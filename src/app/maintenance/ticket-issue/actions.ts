

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { maintenanceTicketSchema, type MaintenanceTicket } from './schema';
import { type Unit } from '@/app/property/units/schema';
import { type Property } from '@/app/property/properties/list/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { type Contract } from '@/app/tenancy/contract/schema';
import { type Room } from '@/app/property/rooms/schema';

const ticketsFilePath = path.join(process.cwd(), 'src/app/maintenance/ticket-issue/tickets-data.json');
const propertiesFilePath = path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json');
const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');


async function readTickets(): Promise<MaintenanceTicket[]> {
    try {
        await fs.access(ticketsFilePath);
        const data = await fs.readFile(ticketsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeTickets([]);
            return [];
        }
        throw error;
    }
}

async function writeTickets(data: MaintenanceTicket[]) {
    await fs.writeFile(ticketsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getTickets() {
    return await readTickets();
}

export async function getOpenTickets(): Promise<{ value: string, label: string }[]> {
    const tickets = await readTickets();
    return tickets
        .filter(t => t.status !== 'Completed' && t.status !== 'Cancelled')
        .map(t => ({ value: t.id, label: `${t.ticketNo} - ${t.issueType}` }));
}

export async function getNextTicketNumber() {
    const allTickets = await readTickets();
    let maxNum = 0;
    allTickets.forEach(ticket => {
        const match = ticket.ticketNo.match(/^TKT-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `TKT-${(maxNum + 1).toString().padStart(4, '0')}`;
}

const addTicketFormSchema = maintenanceTicketSchema.omit({ id: true });

export async function addTicket(data: z.infer<typeof addTicketFormSchema>, isAutoCode: boolean) {
    const validation = addTicketFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allTickets = await readTickets();
        const ticketData = validation.data;

        if (isAutoCode) {
            ticketData.ticketNo = await getNextTicketNumber();
        } else {
             const ticketExists = allTickets.some(t => t.ticketNo === ticketData.ticketNo);
             if (ticketExists) {
                return { success: false, error: `Ticket with number "${ticketData.ticketNo}" already exists.` };
             }
        }
        
        const newTicket: MaintenanceTicket = {
            ...ticketData,
            id: `TKT-${Date.now()}`,
        };

        allTickets.push(newTicket);
        await writeTickets(allTickets);
        
        revalidatePath('/maintenance/ticket-issue');
        return { success: true, data: newTicket };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

const updateTicketFormSchema = maintenanceTicketSchema.partial();

export async function updateTicket(data: z.infer<typeof updateTicketFormSchema>) {
     const validation = updateTicketFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const { id, ...dataToUpdate } = validation.data;

    try {
        const allTickets = await readTickets();
        const ticketIndex = allTickets.findIndex(t => t.id === id);
        if (ticketIndex === -1) {
            return { success: false, error: 'Ticket not found.' };
        }
        
        allTickets[ticketIndex] = { ...allTickets[ticketIndex], ...dataToUpdate };
        
        await writeTickets(allTickets);
        
        revalidatePath('/maintenance/ticket-issue');
        return { success: true, data: allTickets[ticketIndex] };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function deleteTicket(ticketId: string) {
    try {
        const allTickets = await readTickets();
        const updatedTickets = allTickets.filter(t => t.id !== ticketId);

        if (allTickets.length === updatedTickets.length) {
            return { success: false, error: 'Ticket not found.' };
        }
        
        await writeTickets(updatedTickets);
        revalidatePath('/maintenance/ticket-issue');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


async function readProperties(): Promise<{propertyData: Property}[]> {
    try {
        const data = await fs.readFile(propertiesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
async function readUnits(): Promise<Unit[]> {
    try {
        const data = await fs.readFile(unitsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
async function readTenants(): Promise<{tenantData: Tenant}[]> {
    try {
        const data = await fs.readFile(tenantsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
async function readRooms(): Promise<Room[]> {
    try {
        const data = await fs.readFile(roomsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}


export async function getLookups() {
    const properties = await readProperties();
    const units = await readUnits();
    const tenants = await readTenants();
    const rooms = await readRooms();

    return {
        properties: properties.map(p => ({ value: p.propertyData.code, label: p.propertyData.name })),
        units: units.map(u => ({ value: u.unitCode, label: u.unitCode, propertyCode: u.propertyCode })),
        tenants: tenants.map(t => ({ value: t.tenantData.name, label: t.tenantData.name })),
        rooms: rooms.map(r => ({ value: r.roomCode, label: r.roomCode, propertyCode: r.propertyCode, unitCode: r.unitCode }))
    }
}

export async function getTenantForProperty(propertyCode: string, unitCode: string, roomCode?: string) {
    try {
        const contracts: Contract[] = await fs.readFile(contractsFilePath, 'utf-8').then(JSON.parse);
        
        const activeContract = contracts.find(c =>
            c.property === propertyCode &&
            c.unitCode === unitCode &&
            (roomCode ? c.roomCode === roomCode : true) && // Match room if provided
            (c.status === 'New' || c.status === 'Renew')
        );

        if (activeContract) {
            return { success: true, tenantName: activeContract.tenantName };
        }
        return { success: false, error: 'No active tenant found for this location.' };

    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
