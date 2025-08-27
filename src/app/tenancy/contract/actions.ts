

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { contractSchema, type Contract } from './schema';
import { type Unit } from '@/app/property/units/schema';
import { type Floor } from '@/app/property/floors/schema';
import { type Room } from '@/app/property/rooms/schema';
import { type Tenant } from '@/app/tenancy/tenants/schema';
import { addCheque } from '@/app/finance/cheque-deposit/actions';
import { differenceInDays, parseISO } from 'date-fns';

const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const unitsFilePath = path.join(process.cwd(), 'src/app/property/units/units-data.json');
const propertiesFilePath = path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json');
const floorsFilePath = path.join(process.cwd(), 'src/app/property/floors/floors-data.json');
const roomsFilePath = path.join(process.cwd(), 'src/app/property/rooms/rooms-data.json');
const tenantsFilePath = path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');


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

async function readContracts(): Promise<Contract[]> {
    try {
        await fs.access(contractsFilePath);
        const data = await fs.readFile(contractsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeContracts(data: Contract[]) {
    await fs.writeFile(contractsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAllContracts() {
    const contracts = await readContracts();
    return processContracts(contracts);
}

function processContracts(contracts: Contract[]): Contract[] {
    const contractsByTenant = new Map<string, Contract[]>();

    for (const contract of contracts) {
        if (!contract.tenantCode) continue;
        if (!contractsByTenant.has(contract.tenantCode)) {
            contractsByTenant.set(contract.tenantCode, []);
        }
        contractsByTenant.get(contract.tenantCode)!.push(contract);
    }
    
    const processedContracts: Contract[] = [];

    for (const tenantContracts of contractsByTenant.values()) {
        const sortedContracts = tenantContracts.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        for (let i = 0; i < sortedContracts.length; i++) {
            const current = sortedContracts[i];
            const previous = i > 0 ? sortedContracts[i - 1] : null;

            if (!previous) {
                 if (current.status === 'Renew') {
                    current.periodStatus = 'Orphaned';
                } else {
                    current.periodStatus = 'OK';
                }
            } else {
                const prevEndDate = parseISO(previous.endDate);
                const currStartDate = parseISO(current.startDate);
                const daysDiff = differenceInDays(currStartDate, prevEndDate);

                if (daysDiff === 1) {
                    current.periodStatus = 'OK';
                } else if (daysDiff > 1) {
                    current.periodStatus = 'Gap';
                } else { // daysDiff <= 0
                    current.periodStatus = 'Overlap';
                }
            }
             processedContracts.push(current);
        }
    }
    
    // Add back contracts without tenant codes
    const contractsWithTenantCode = new Set(processedContracts.map(c => c.id));
    contracts.forEach(c => {
        if(!c.tenantCode) {
            processedContracts.push(c);
        }
    });

    return processedContracts.sort((a,b) => a.contractNo.localeCompare(b.contractNo));
}


async function createChequesFromContract(contract: Contract) {
    if (contract.paymentMode !== 'cheque' || !contract.paymentSchedule) {
        return;
    }

    for (const installment of contract.paymentSchedule) {
        if (installment.chequeNo) {
            await addCheque({
                chequeNo: installment.chequeNo,
                chequeDate: installment.dueDate,
                amount: installment.amount,
                bankName: installment.bankName || '',
                status: 'In Hand',
                type: 'Incoming',
                partyName: contract.tenantName,
                property: contract.property,
                unitCode: contract.unitCode,
                roomCode: contract.roomCode,
                contractNo: contract.contractNo,
                remarks: `Installment ${installment.installment}`,
            });
        }
    }
}

export async function saveContractData(data: Omit<Contract, 'id'> & { id?: string, isAutoContractNo?: boolean }, isNewRecord: boolean) {
    const { isAutoContractNo, ...contractData } = data;
    const validation = contractSchema.omit({id: true}).safeParse(contractData);

    if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(', ');
        return { success: false, error: errors };
    }

    try {
        const allContracts = await readContracts();
        let savedContract: Contract;
        
        if (isNewRecord) {
             let newContractNo = validation.data.contractNo;
             if (isAutoContractNo || !newContractNo) {
                newContractNo = await getNextContractNumber();
             } else {
                const contractExists = allContracts.some(c => c.contractNo === newContractNo);
                if (contractExists) {
                    return { success: false, error: `A contract with number "${newContractNo}" already exists.`};
                }
             }

             const newContract: Contract = {
                ...validation.data,
                contractNo: newContractNo,
                id: `CON-${Date.now()}`,
            };
            allContracts.push(newContract);
            savedContract = newContract;
        } else {
            const index = allContracts.findIndex(c => c.id === data.id);
            if (index !== -1) {
                allContracts[index] = validation.data as Contract;
                savedContract = validation.data as Contract;
            } else {
                 return { success: false, error: `Contract with ID "${data.id}" not found.` };
            }
        }
        
        await writeContracts(allContracts);
        
        await createChequesFromContract(savedContract);
        
        revalidatePath('/tenancy/contracts');
        revalidatePath('/finance/cheque-deposit');
        revalidatePath(`/tenancy/contract?id=${data.id}`);
        return { success: true, data: savedContract };

    } catch (error) {
        console.error('Failed to save contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

async function getNextContractNumber() {
    const allContracts = await readContracts();
    let maxNum = 0;
    allContracts.forEach(c => {
        const match = c.contractNo.match(/^TC-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `TC-${(maxNum + 1).toString().padStart(4, '0')}`;
}

export async function findContract(query: { unitCode?: string, tenantName?: string, contractId?: string }): Promise<{ success: boolean; data?: Contract; error?: string }> {
    try {
        const allContracts = await readContracts();
        let foundContract: Contract | undefined;

        if (query.contractId === 'new') {
            const newContractNo = await getNextContractNumber();
            return { success: true, data: { ...initialContractState, contractNo: newContractNo } };
        }
        
        if (query.contractId) {
            foundContract = allContracts.find(c => c.id === query.contractId);
        } else if (query.unitCode) {
            foundContract = allContracts.find(c => c.unitCode === query.unitCode);
        } else if (query.tenantName) {
            foundContract = allContracts.find(c => c.tenantName.toLowerCase() === query.tenantName.toLowerCase());
        }

        if (foundContract) {
            // After finding the contract, process it to determine its continuity status
            const processedContracts = processContracts(allContracts);
            const finalContractData = processedContracts.find(c => c.id === foundContract!.id);
            return { success: true, data: finalContractData };
        } else {
            return { success: false, error: 'Contract not found.' };
        }
    } catch (error) {
        console.error('Failed to find contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}


const initialContractState: Contract = {
    id: '',
    contractNo: '',
    contractDate: '',
    unitCode: '',
    roomCode: '',
    property: '',
    tenantCode: '',
    tenantName: '',
    mobile: '',
    email: '',
    address: '',
    startDate: '',
    endDate: '',
    totalRent: 0,
    paymentMode: 'cash',
    status: 'New',
    terminationDate: '',
    rentBasedOn: 'Monthly',
    paymentFrequency: 'Monthly',
    numberOfPayments: 1,
    gracePeriod: 0,
    paymentSchedule: [],
    terms: '',
    tawtheeqRegistrationNo: '',
    tawtheeqStatus: 'Not Registered',
    tawtheeqRegistrationDate: '',
};

export async function deleteContract(contractId: string) {
    try {
        const allContracts = await readContracts();
        const updatedContracts = allContracts.filter(c => c.id !== contractId);

        if (allContracts.length === updatedContracts.length) {
            return { success: false, error: 'Contract not found.' };
        }
        
        await writeContracts(updatedContracts);
        revalidatePath('/tenancy/contracts');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete contract:', error);
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

async function readProperties() {
    try {
        const data = await fs.readFile(propertiesFilePath, 'utf-8');
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

async function readTenants(): Promise<{tenantData: Tenant}[]> {
    try {
        const data = await fs.readFile(tenantsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}


export async function getContractLookups() {
    const properties = await readProperties();
    const tenants = await readTenants();
    return {
        properties: properties.map((p: any) => ({ value: (p.propertyData || p).code, label: (p.propertyData || p).name })),
        tenants: tenants.map((t: any) => ({ value: t.tenantData.code, label: t.tenantData.name, ...t.tenantData })),
    }
}

export async function getUnitsForProperty(propertyCode: string) {
    const allUnits = await readUnits();
    const allRooms = await readRooms();
    const allContracts: Contract[] = await readContracts();
    
    const activeContracts = allContracts.filter(c => c.status === 'New' || c.status === 'Renew');
    
    const fullyOccupiedUnitCodes = new Set(activeContracts.filter(c => !c.roomCode && c.unitCode).map(c => c.unitCode));
    const occupiedRoomCodes = new Set(activeContracts.filter(c => c.roomCode).map(c => c.roomCode));

    const unitsWithRoomCounts = new Map<string, { total: number, occupied: number }>();

    allRooms.forEach(room => {
        if (room.propertyCode === propertyCode) {
            if (!unitsWithRoomCounts.has(room.unitCode!)) {
                unitsWithRoomCounts.set(room.unitCode!, { total: 0, occupied: 0 });
            }
            const counts = unitsWithRoomCounts.get(room.unitCode!)!;
            counts.total++;
            if (occupiedRoomCodes.has(room.roomCode)) {
                counts.occupied++;
            }
        }
    });

    return allUnits
        .filter(u => {
            if (u.propertyCode !== propertyCode) {
                return false;
            }
            if (fullyOccupiedUnitCodes.has(u.unitCode)) {
                return false;
            }
            const roomCounts = unitsWithRoomCounts.get(u.unitCode);
            if (roomCounts) {
                return roomCounts.occupied < roomCounts.total;
            }
            return true;
        })
        .map((u: any) => ({ value: u.unitCode, label: u.unitCode }));
}

export async function getRoomsForUnit(propertyCode: string, unitCode: string) {
    const allRooms = await readRooms();
    const allContracts: Contract[] = await readContracts();
    const occupiedRoomCodes = new Set(allContracts.filter(c => c.status === 'New' || c.status === 'Renew').map(c => c.roomCode));

    return allRooms
        .filter(r => r.propertyCode === propertyCode && r.unitCode === unitCode && !occupiedRoomCodes.has(r.roomCode))
        .map((r: any) => ({ value: r.roomCode, label: r.roomCode }));
}

export async function getUnitDetails(unitCode: string) {
    const allUnits = await readUnits();
    const unit = allUnits.find(u => u.unitCode === unitCode);

    if (!unit) {
        return { success: false, error: 'Unit not found' };
    }
    
    return { 
        success: true, 
        data: {
            totalRent: unit.annualRent,
        }
    };
}

export async function getRoomDetails(roomCode: string) {
    const allRooms = await readRooms();
    const room = allRooms.find(r => r.roomCode === roomCode);
    if (!room) {
        return { success: false, error: 'Room not found' };
    }
    return { success: true, data: room };
}

const moveTenantSchema = z.object({
    contractId: z.string(),
    newPropertyCode: z.string(),
    newUnitCode: z.string(),
    newRoomCode: z.string().optional(),
    moveDate: z.string(),
});

export async function moveTenant(data: z.infer<typeof moveTenantSchema>) {
    const validation = moveTenantSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data provided.' };
    }

    const { contractId, newPropertyCode, newUnitCode, newRoomCode, moveDate } = validation.data;

    try {
        const allContracts = await readContracts();
        const contractIndex = allContracts.findIndex(c => c.id === contractId);

        if (contractIndex === -1) {
            return { success: false, error: 'Active contract not found for this tenant.' };
        }

        const contract = allContracts[contractIndex];
        const oldLocation = `${contract.property}/${contract.unitCode}${contract.roomCode ? '/'+contract.roomCode : ''}`;
        const newLocation = `${newPropertyCode}/${newUnitCode}${newRoomCode ? '/'+newRoomCode : ''}`;

        contract.property = newPropertyCode;
        contract.unitCode = newUnitCode;
        contract.roomCode = newRoomCode;

        contract.paymentSchedule.push({
            installment: 0, 
            dueDate: moveDate,
            amount: 0,
            status: 'paid', 
            chequeNo: 'MOVEMENT',
            bankName: `Moved from ${oldLocation} to ${newLocation}`,
        });
        
        allContracts[contractIndex] = contract;

        await writeContracts(allContracts);

        revalidatePath('/tenancy/tenants/add');
        revalidatePath('/property/properties');
        revalidatePath('/property/units/vacant');
        
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

    