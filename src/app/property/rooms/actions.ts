
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { roomSchema, type Room } from './schema';
import { type Unit } from '@/app/property/units/schema';

const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');

async function readRooms(): Promise<Room[]> {
    try {
        await fs.access(roomsFilePath);
        const data = await fs.readFile(roomsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeRooms([]);
            return [];
        }
        throw error;
    }
}

async function writeRooms(data: Room[]) {
    await fs.writeFile(roomsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getRooms() {
    return await readRooms();
}

export async function getRoomsForProperty(propertyCode: string) {
    try {
        const allRooms = await readRooms();
        const propertyRooms = allRooms.filter(r => r.propertyCode === propertyCode);
        return { success: true, data: propertyRooms };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

const addRoomFormSchema = roomSchema.omit({ id: true });

export async function addRoom(data: z.infer<typeof addRoomFormSchema>) {
    const validation = addRoomFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allRooms = await readRooms();
        const roomExists = allRooms.some(r => r.roomCode === data.roomCode && r.propertyCode === data.propertyCode);
        if (roomExists) {
            return { success: false, error: `Room with code "${data.roomCode}" already exists in this property.` };
        }

        const newRoom: Room = {
            ...validation.data,
            id: `ROOM-${Date.now()}`,
        };

        allRooms.push(newRoom);
        await writeRooms(allRooms);
        
        revalidatePath(`/property/properties?code=${data.propertyCode}`);
        return { success: true, data: newRoom };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

const updateRoomFormSchema = roomSchema.partial();

export async function updateRoom(data: z.infer<typeof updateRoomFormSchema>) {
     const validation = updateRoomFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }
    
    const { id, ...dataToUpdate } = validation.data;

    try {
        const allRooms = await readRooms();
        const roomIndex = allRooms.findIndex(r => r.id === id);
        if (roomIndex === -1) {
            return { success: false, error: 'Room not found.' };
        }
        
        allRooms[roomIndex] = { ...allRooms[roomIndex], ...dataToUpdate };
        
        await writeRooms(allRooms);
        
        revalidatePath(`/property/properties?code=${allRooms[roomIndex].propertyCode}`);
        return { success: true, data: allRooms[roomIndex] };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function deleteRoom(roomId: string) {
    try {
        const allRooms = await readRooms();
        const roomToDelete = allRooms.find(r => r.id === roomId);
        if (!roomToDelete) {
             return { success: false, error: 'Room not found.' };
        }

        const updatedRooms = allRooms.filter(r => r.id !== roomId);
        
        await writeRooms(updatedRooms);
        revalidatePath(`/property/properties?code=${roomToDelete.propertyCode}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

async function readFloors() {
    try {
        const data = await fs.readFile(path.join(process.cwd(), 'src/app/property/floors/floors-data.json'), 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

async function readUnits(): Promise<Unit[]> {
    try {
        const data = await fs.readFile(path.join(process.cwd(), 'src/app/property/units/units-data.json'), 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}


export async function getRoomLookups(propertyCode: string) {
    const floors = await readFloors();
    const units = await readUnits();
    return {
        floors: floors.filter((f: any) => f.propertyCode === propertyCode).map((f:any) => ({ value: f.floorCode, label: f.floorName })),
        units: units.filter((u: any) => u.propertyCode === propertyCode).map((u:any) => ({ value: u.unitCode, label: u.unitCode })),
    }
}
