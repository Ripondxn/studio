
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { partitionSchema, type Partition } from './schema';
import { type Unit } from '@/app/property/units/schema';
import { type Floor } from '@/app/property/floors/schema';
import { type Room } from '@/app/property/rooms/schema';
import { type Contract } from '@/app/tenancy/contract/schema';

const partitionsFilePath = path.join(process.cwd(), 'src/app/property/partitions/partitions-data.json');
const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');
const floorsFilePath = path.join(process.cwd(), 'src/app/property/floors/floors-data.json');
const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');


async function readPartitions(): Promise<Partition[]> {
    try {
        await fs.access(partitionsFilePath);
        const data = await fs.readFile(partitionsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writePartitions([]);
            return [];
        }
        throw error;
    }
}

async function writePartitions(data: Partition[]) {
    await fs.writeFile(partitionsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getPartitions() {
    const allPartitions = await readPartitions();
    const contractsData = await fs.readFile(contractsFilePath, 'utf-8').catch(() => '[]');
    const allContracts: Contract[] = JSON.parse(contractsData);

    const occupiedPartitionCodes = new Set(
        allContracts
            .filter(c => c.status === 'New' || c.status === 'Renew')
            .map(c => c.partitionCode)
    );

    return allPartitions.map(partition => ({
        ...partition,
        occupancyStatus: occupiedPartitionCodes.has(partition.partitionCode) ? 'Occupied' : 'Vacant',
    }));
}

export async function getPartitionsForProperty(propertyCode: string) {
    try {
        const allPartitions = await getPartitions();
        const propertyPartitions = allPartitions.filter(p => p.propertyCode === propertyCode);
        return { success: true, data: propertyPartitions };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

const addPartitionFormSchema = partitionSchema.omit({ id: true, occupancyStatus: true });

export async function addPartition(data: z.infer<typeof addPartitionFormSchema>) {
    const validation = addPartitionFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allPartitions = await readPartitions();
        const partitionExists = allPartitions.some(p => p.partitionCode === data.partitionCode && p.propertyCode === data.propertyCode);
        if (partitionExists) {
            return { success: false, error: `Partition with code "${data.partitionCode}" already exists in this property.` };
        }

        const newPartition: Partition = {
            ...validation.data,
            id: `PART-${Date.now()}`,
        };

        allPartitions.push(newPartition);
        await writePartitions(allPartitions);
        
        revalidatePath(`/property/properties?code=${data.propertyCode}`);
        return { success: true, data: newPartition };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

const updatePartitionFormSchema = partitionSchema.partial();

export async function updatePartition(data: z.infer<typeof updatePartitionFormSchema>) {
     const validation = updatePartitionFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const { id, ...dataToUpdate } = validation.data;

    try {
        const allPartitions = await readPartitions();
        const partitionIndex = allPartitions.findIndex(p => p.id === id);
        if (partitionIndex === -1) {
            return { success: false, error: 'Partition not found.' };
        }
        
        allPartitions[partitionIndex] = { ...allPartitions[partitionIndex], ...dataToUpdate };
        
        await writePartitions(allPartitions);
        
        revalidatePath(`/property/properties?code=${allPartitions[partitionIndex].propertyCode}`);
        return { success: true, data: allPartitions[partitionIndex] };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function deletePartition(partitionId: string) {
    try {
        const allPartitions = await readPartitions();
        const partitionToDelete = allPartitions.find(p => p.id === partitionId);
        if (!partitionToDelete) {
             return { success: false, error: 'Partition not found.' };
        }

        const updatedPartitions = allPartitions.filter(p => p.id !== partitionId);
        
        await writePartitions(updatedPartitions);
        revalidatePath(`/property/properties?code=${partitionToDelete.propertyCode}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
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

async function readFloors(): Promise<Floor[]> {
    try {
        const data = await fs.readFile(floorsFilePath, 'utf-8');
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


export async function getPartitionLookups(propertyCode: string) {
    const units = await readUnits();
    const floors = await readFloors();
    const rooms = await readRooms();

    return {
        units: units.filter((u: any) => u.propertyCode === propertyCode).map((u:any) => ({ value: u.unitCode, label: u.unitCode })),
        floors: floors.filter((f: any) => f.propertyCode === propertyCode).map((f:any) => ({ value: f.floorCode, label: f.floorName })),
        rooms: rooms.filter((r: any) => r.propertyCode === propertyCode).map((r:any) => ({ value: r.roomCode, label: r.roomName })),
    }
}
