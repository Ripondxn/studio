
'use server';

import { firestoreAdmin } from '@/lib/firebase/admin-config';
import { type Unit } from '@/app/property/units/schema';
import { type Contract } from '@/app/tenancy/contract/schema';
import { type Room } from '../rooms/schema';

async function getProperties() {
    const propertiesCollection = firestoreAdmin.collection('properties');
    const snapshot = await propertiesCollection.get();
    return snapshot.docs.map(doc => doc.data());
}

async function writeProperties(data: any) {
    const propertiesCollection = firestoreAdmin.collection('properties');
    for (const property of data) {
        await propertiesCollection.doc(property.id).set(property);
    }
}

export async function savePropertyData(dataToSave: any, isNewRecord: boolean) {
    try {
        const allProperties:any = await getProperties();

        if (isNewRecord) {
            const propertyExists = allProperties.some((p: any) => (p.propertyData ? p.propertyData.code : p.code) === dataToSave.propertyData.code);
            if (propertyExists) {
                return { success: false, error: `Property with code "${dataToSave.propertyData.code}" already exists.` };
            }
            const newProperty = {
                id: `PROP-${Date.now()}`,
                ...dataToSave
            };
            await firestoreAdmin.collection('properties').doc(newProperty.id).set(newProperty);
        } else {
            const property = allProperties.find((p: any) => {
                const code = p.propertyData ? p.propertyData.code : p.code;
                return code === dataToSave.propertyData.code;
            });

            if (property) {
                const updatedProperty = {
                    ...property,
                    ...dataToSave,
                    id: property.id
                };
                await firestoreAdmin.collection('properties').doc(property.id).set(updatedProperty);
            } else {
                const newProperty = {
                    id: `PROP-${Date.now()}`,
                    ...dataToSave,
                };
                await firestoreAdmin.collection('properties').doc(newProperty.id).set(newProperty);
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to save property data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

export async function findPropertyData(propertyCode: string) {
    try {
        const propertiesCollection = firestoreAdmin.collection('properties');
        const snapshot = await propertiesCollection.where('propertyData.code', '==', propertyCode).get();
        
        if (snapshot.empty) {
            return { success: false, error: "Not Found" };
        }

        return { success: true, data: snapshot.docs[0].data() };
    } catch (error) {
        console.error('Failed to find property data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

export async function deletePropertyData(propertyCode: string) {
    try {
        const propertiesCollection = firestoreAdmin.collection('properties');
        const snapshot = await propertiesCollection.where('propertyData.code', '==', propertyCode).get();

        if (snapshot.empty) {
            return { success: false, error: 'Property not found.' };
        }

        const docId = snapshot.docs[0].id;
        await propertiesCollection.doc(docId).delete();

        return { success: true };
    } catch (error) {
        console.error('Failed to delete property data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

export async function getOccupancyInfoForProperty(propertyCode: string) {
    try {
        const contractsCollection = firestoreAdmin.collection('contracts');
        const snapshot = await contractsCollection.where('property', '==', propertyCode).get();
        const occupancyInfo = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                unitCode: data.unitCode,
                tenantName: data.tenantName,
                contractId: data.id,
            };
        });

        return { success: true, data: occupancyInfo };
    } catch (error) {
        console.error('Failed to get occupancy info:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

async function readUnits(): Promise<Unit[]> {
    const unitsCollection = firestoreAdmin.collection('units');
    const snapshot = await unitsCollection.get();
    return snapshot.docs.map(doc => doc.data() as Unit);
}

async function readRooms(): Promise<Room[]> {
    const roomsCollection = firestoreAdmin.collection('rooms');
    const snapshot = await roomsCollection.get();
    return snapshot.docs.map(doc => doc.data() as Room);
}


export async function getUnitsForProperty(propertyCode: string): Promise<{ success: boolean, data?: Unit[], error?: string }> {
    try {
        const allUnits = await readUnits();
        const allRooms = await readRooms();
        const contractsCollection = firestoreAdmin.collection('contracts');
        const contractsSnapshot = await contractsCollection.get();
        const allContracts: Contract[] = contractsSnapshot.docs.map(doc => doc.data() as Contract);

        const activeContracts = allContracts.filter(c => c.status === 'New' || c.status === 'Renew');
        
        const unitLevelContractCodes = new Set(activeContracts.filter(c => !c.roomCode && c.unitCode).map(c => c.unitCode));
        const occupiedRoomCodes = new Set(activeContracts.filter(c => c.roomCode).map(c => c.roomCode));

        const propertyUnits = allUnits
            .filter(u => u.propertyCode === propertyCode)
            .map(unit => {
                let occupancyStatus: 'Vacant' | 'Occupied' | 'Partially Occupied' = 'Vacant';

                if (unitLevelContractCodes.has(unit.unitCode)) {
                    occupancyStatus = 'Occupied';
                } else {
                    const roomsInUnit = allRooms.filter(r => r.propertyCode === unit.propertyCode && r.unitCode === unit.unitCode);
                    if (roomsInUnit.length > 0) {
                        const occupiedRoomsCount = roomsInUnit.filter(r => occupiedRoomCodes.has(r.roomCode)).length;

                        if (occupiedRoomsCount === 0) {
                            occupancyStatus = 'Vacant';
                        } else if (occupiedRoomsCount < roomsInUnit.length) {
                            occupancyStatus = 'Partially Occupied';
                        } else {
                            occupancyStatus = 'Occupied';
                        }
                    } else {
                        occupancyStatus = 'Vacant';
                    }
                }
                
                return {
                    ...unit,
                    occupancyStatus,
                };
            });
            
        return { success: true, data: propertyUnits };
    } catch (error) {
        console.error('Failed to get units for property:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

async function readLandlords() {
    const landlordsCollection = firestoreAdmin.collection('landlords');
    const snapshot = await landlordsCollection.get();
    return snapshot.docs.map(doc => doc.data());
}

export async function getPropertyLookups() {
    const landlords:any = await readLandlords();
    return {
        landlords: landlords.map((l: any) => ({ code: l.landlordData.code, name: l.landlordData.name })),
    }
}
