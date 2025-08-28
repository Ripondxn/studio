
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Property } from '@/app/property/properties/list/schema';
import { type Unit } from '@/app/property/units/schema';
import { type Room } from '@/app/property/rooms/schema';
import { type Contract } from '@/app/tenancy/contract/schema';

async function readData(filePath: string): Promise<any[]> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export interface PropertyOverview extends Property {
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    totalRooms: number;
    occupiedRooms: number;
    vacantRooms: number;
    occupancyRate: number;
}

export async function getPropertyOverview(): Promise<PropertyOverview[]> {
    const properties: {propertyData: Property}[] = await readData(path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json'));
    const units: Unit[] = await readData(path.join(process.cwd(), 'src/app/property/units/units-data.json'));
    const rooms: Room[] = await readData(path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json'));
    const contracts: Contract[] = await readData(path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json'));

    const activeContracts = contracts.filter(c => c.status === 'New' || c.status === 'Renew');
    const occupiedUnitCodes = new Set(activeContracts.filter(c => c.unitCode && !c.roomCode).map(c => c.unitCode));
    const occupiedRoomCodes = new Set(activeContracts.filter(c => c.roomCode).map(c => c.roomCode));

    const overview: PropertyOverview[] = properties.map(p => {
        const propData = p.propertyData;
        const unitsInProperty = units.filter(u => u.propertyCode === propData.code);
        const roomsInProperty = rooms.filter(r => r.propertyCode === propData.code);

        const totalUnits = unitsInProperty.length;
        const totalRooms = roomsInProperty.length;
        
        const occupiedUnits = unitsInProperty.filter(u => occupiedUnitCodes.has(u.unitCode)).length;
        const occupiedRooms = roomsInProperty.filter(r => occupiedRoomCodes.has(r.roomCode)).length;
        
        const totalRentableSpaces = totalUnits + totalRooms;
        const totalOccupiedSpaces = occupiedUnits + occupiedRooms;

        const occupancyRate = totalRentableSpaces > 0 ? (totalOccupiedSpaces / totalRentableSpaces) * 100 : 0;

        return {
            ...propData,
            totalUnits,
            occupiedUnits,
            vacantUnits: totalUnits - occupiedUnits,
            totalRooms,
            occupiedRooms,
            vacantRooms: totalRooms - occupiedRooms,
            occupancyRate,
        };
    });

    return overview;
}
