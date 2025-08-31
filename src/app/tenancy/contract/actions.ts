

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
import { differenceInDays, parseISO, addDays } from 'date-fns';
import { getUnits } from '@/app/property/units/actions';
import { getRooms } from '@/app/property/rooms/actions';


const contractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const propertiesFilePath = path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json');
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
    return await readContracts();
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
                partyType: 'Tenant',
                partyName: contract.tenantCode,
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
        const validatedData = validation.data;
        
        let savedContract: Contract;
        
        if (isNewRecord) {
             let newContractNo = validatedData.contractNo;
             if (isAutoContractNo || !newContractNo) {
                newContractNo = await getNextContractNumber();
             } else {
                const contractExists = allContracts.some(c => c.contractNo === newContractNo);
                if (contractExists) {
                    return { success: false, error: `A contract with number "${newContractNo}" already exists.`};
                }
             }

             const newContract: Contract = {
                ...validatedData,
                contractNo: newContractNo,
                id: `CON-${Date.now()}`,
            };
            allContracts.push(newContract);
            savedContract = newContract;
        } else {
            const index = allContracts.findIndex(c => c.id === data.id);
            if (index !== -1) {
                allContracts[index] = { ...allContracts[index], ...validatedData };
                savedContract = allContracts[index];
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
            return { success: true, data: foundContract };
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

async function readProperties() {
    try {
        const data = await fs.readFile(propertiesFilePath, 'utf-8');
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
    const units = await getUnits();
    const rooms = await getRooms();

    return {
        properties: properties.map((p: any) => ({ value: (p.propertyData || p).code, label: (p.propertyData || p).name })),
        tenants: tenants.map((t: any) => ({ value: t.tenantData.code, label: t.tenantData.name, ...t.tenantData })),
        units: units.map(u => ({...u, value: u.unitCode, label: u.unitCode })),
        rooms: rooms.map(r => ({...r, value: r.roomCode, label: r.roomCode })),
    }
}

export async function getUnitsForProperty(propertyCode: string) {
    const allUnits = await getUnits();
    return allUnits
        .filter(u => u.propertyCode === propertyCode && u.occupancyStatus !== 'Occupied')
        .map((u: any) => ({ ...u, value: u.unitCode, label: u.unitCode }));
}

export async function getRoomsForUnit(propertyCode: string, unitCode: string) {
    const allRooms = await getRooms();
    return allRooms
        .filter(r => r.propertyCode === propertyCode && r.unitCode === unitCode && r.occupancyStatus === 'Vacant')
        .map((r: any) => ({ ...r, value: r.roomCode, label: r.roomCode }));
}

export async function getUnitDetails(unitCode: string) {
    const allUnits = await getUnits();
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
    const allRooms = await getRooms();
    const room = allRooms.find(r => r.roomCode === roomCode);
    if (!room) {
        return { success: false, error: 'Room not found' };
    }
    return { success: true, data: room };
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

export async function getLatestContractForTenant(tenantCode: string): Promise<{ success: boolean; data?: Contract; error?: string }> {
    if (!tenantCode) {
        return { success: false, error: "Tenant code is required." };
    }
    try {
        const allContracts = await readContracts();
        const tenantContracts = allContracts.filter(c => c.tenantCode === tenantCode);
        if (tenantContracts.length === 0) {
            return { success: false, error: 'No contracts found for this tenant.' };
        }
        tenantContracts.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
        return { success: true, data: tenantContracts[0] };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

