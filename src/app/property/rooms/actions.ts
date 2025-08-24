

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { roomSchema, type Room } from './schema';
import { type Unit } from '@/app/property/units/schema';
import { type Contract } from '@/app/tenancy/contract/schema';

const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');
const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');


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
    const allRooms = await readRooms();
    const contractsData = await fs.readFile(contractsFilePath, 'utf-8').catch(() => '[]');
    const allContracts: Contract[] = JSON.parse(contractsData);

    const occupiedRoomCodes = new Set(
        allContracts
            .filter(c => c.status === 'New' || c.status === 'Renew')
            .map(c => c.roomCode)
    );

    return allRooms.map(room => ({
        ...room,
        occupancyStatus: occupiedRoomCodes.has(room.roomCode) ? 'Occupied' : 'Vacant',
    }));
}

export async function getRoomsForProperty(propertyCode: string) {
    try {
        const allRooms = await getRooms();
        const propertyRooms = allRooms.filter(r => r.propertyCode === propertyCode);
        return { success: true, data: propertyRooms };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

const addRoomFormSchema = roomSchema.omit({ id: true, occupancyStatus: true });

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
        
        revalidatePath(`/property/properties`);
        revalidatePath(`/property/properties/add`);
        revalidatePath(`/property/properties/list`);
        revalidatePath(`/property/rooms/list`);
        if (data.propertyCode) {
            revalidatePath(`/property/properties?code=${data.propertyCode}`);
        }
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
        
        revalidatePath(`/property/properties`);
        revalidatePath(`/property/properties/add`);
        revalidatePath(`/property/properties/list`);
        revalidatePath(`/property/rooms/list`);
        if (allRooms[roomIndex].propertyCode) {
            revalidatePath(`/property/properties?code=${allRooms[roomIndex].propertyCode}`);
        }
        return { success: true, data: allRooms[roomIndex] };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function deleteRoom(roomId: string) {
    if (!roomId) {
        return { success: false, error: "Room ID is required." };
    }

    try {
        const allRooms = await readRooms();
        const roomToDelete = allRooms.find(r => r.id === roomId);
        
        if (!roomToDelete) {
             return { success: false, error: 'Room not found.' };
        }

        const updatedRooms = allRooms.filter(r => r.id !== roomId);
        
        await writeRooms(updatedRooms);
        revalidatePath(`/property/properties`);
        revalidatePath(`/property/properties/add`);
        revalidatePath(`/property/properties/list`);
        revalidatePath(`/property/rooms/list`);
        if (roomToDelete.propertyCode) {
           revalidatePath(`/property/properties?code=${roomToDelete.propertyCode}`);
        }
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

const importRoomSchema = roomSchema.omit({ id: true, occupancyStatus: true });
const importRoomsSchema = z.array(importRoomSchema);

export async function importRooms(roomsData: unknown) {
    const validation = importRoomsSchema.safeParse(roomsData);
    if (!validation.success) {
        console.error("Import validation error:", validation.error.format());
        return { success: false, error: 'Invalid data format for one or more rows.' };
    }
    
    try {
        const allRooms = await readRooms();
        let updatedCount = 0;
        let addedCount = 0;
        let propertyCodeForRevalidation = '';

        validation.data.forEach(importedRoom => {
            if (importedRoom.propertyCode) {
                 propertyCodeForRevalidation = importedRoom.propertyCode;
            }

            const existingRoomIndex = allRooms.findIndex(r => r.roomCode === importedRoom.roomCode && r.propertyCode === importedRoom.propertyCode);
            
            if (existingRoomIndex > -1) {
                // Update existing room
                allRooms[existingRoomIndex] = { ...allRooms[existingRoomIndex], ...importedRoom };
                updatedCount++;
            } else {
                // Add new room
                const newRoom: Room = {
                    ...importedRoom,
                    id: `ROOM-${Date.now()}-${Math.random()}`.replace('.', ''),
                };
                allRooms.push(newRoom);
                addedCount++;
            }
        });

        await writeRooms(allRooms);
        
        if (propertyCodeForRevalidation) {
            revalidatePath(`/property/properties?code=${propertyCodeForRevalidation}`);
        }
        
        return { success: true, added: addedCount, updated: updatedCount };

    } catch (error) {
        console.error("Error importing rooms:", error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred during import.' };
    }
}

