

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { leaseContractSchema, type LeaseContract } from './schema';
import { type Contract as TenancyContract } from '@/app/tenancy/contract/schema';

const contractsFilePath = path.join(process.cwd(), 'src/app/lease/contract/contracts-data.json');
const tenancyContractsFilePath = path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const propertiesFilePath = path.join(process.cwd(), 'src/app/property/properties/list/properties-data.json');
const landlordsFilePath = path.join(process.cwd(), 'src/app/landlord/landlords-data.json');


async function readContracts(): Promise<LeaseContract[]> {
    try {
        await fs.access(contractsFilePath);
        const data = await fs.readFile(contractsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // If the file doesn't exist, create it with an empty array
            await writeContracts([]);
            return [];
        }
        throw error;
    }
}

async function writeContracts(data: LeaseContract[]) {
    await fs.writeFile(contractsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getAllLeaseContracts() {
    return await readContracts();
}

export async function saveLeaseContractData(data: Omit<LeaseContract, 'id'> & { id?: string, isAutoContractNo?: boolean }, isNewRecord: boolean) {
    const { isAutoContractNo, ...contractData } = data;
    const validation = leaseContractSchema.omit({id: true}).safeParse(contractData);

    if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(', ');
        return { success: false, error: errors };
    }

    try {
        const allContracts = await readContracts();
        let savedContract: LeaseContract;
        const validatedData = validation.data;
        
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

             const newContract: LeaseContract = {
                ...validatedData,
                contractNo: newContractNo,
                id: `LCON-${Date.now()}`,
            };
            allContracts.push(newContract);
            savedContract = newContract;
        } else {
            const index = allContracts.findIndex(c => c.id === data.id);
            if (index !== -1) {
                allContracts[index] = validatedData as LeaseContract;
                savedContract = validatedData as LeaseContract;
            } else {
                 return { success: false, error: `Lease Contract with ID "${data.id}" not found.` };
            }
        }
        
        await writeContracts(allContracts);

        revalidatePath('/lease/contracts');
        revalidatePath('/finance/pdc-cheque');
        revalidatePath(`/lease/contract?id=${savedContract.id}`);
        revalidatePath('/'); // Revalidate dashboard
        return { success: true, data: savedContract };

    } catch (error) {
        console.error('Failed to save lease contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

async function getNextContractNumber() {
    const allContracts = await readContracts();
    let maxNum = 0;
    allContracts.forEach(c => {
        const match = c.contractNo.match(/^LA-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `LA-${(maxNum + 1).toString().padStart(4, '0')}`;
}

export async function findLeaseContract(query: { contractId?: string; contractNo?: string }): Promise<{ success: boolean; data?: LeaseContract; error?: string }> {
    try {
        const allContracts = await readContracts();
        let foundContract: LeaseContract | undefined;

        if (query.contractId === 'new') {
            const newContractNo = await getNextContractNumber();
            return { success: true, data: { ...initialContractState, contractNo: newContractNo } };
        }
        
        if (query.contractId) {
            foundContract = allContracts.find(c => c.id === query.contractId);
        } else if (query.contractNo) {
            foundContract = allContracts.find(c => c.contractNo === query.contractNo);
        }

        if (foundContract) {
            return { success: true, data: foundContract };
        } else {
            return { success: false, error: 'Lease Contract not found.' };
        }
    } catch (error) {
        console.error('Failed to find lease contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

const initialContractState: LeaseContract = {
    id: '',
    contractNo: '',
    contractDate: '',
    property: '',
    landlordCode: '',
    startDate: '',
    endDate: '',
    totalRent: 0,
    vatPercentage: 0,
    vatAmount: 0,
    totalRentWithVat: 0,
    paymentMode: 'cash',
    status: 'New',
    terminationDate: '',
    paymentFrequency: 'Monthly',
    numberOfPayments: 1,
    gracePeriod: 0,
    paymentSchedule: [],
    terms: '',
};


export async function deleteLeaseContract(contractId: string) {
    try {
        const allContracts = await readContracts();
        const updatedContracts = allContracts.filter(c => c.id !== contractId);

        if (allContracts.length === updatedContracts.length) {
            return { success: false, error: 'Lease Contract not found.' };
        }
        
        await writeContracts(updatedContracts);
        revalidatePath('/lease/contracts');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete lease contract:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}

async function readLandlords() {
    try {
        const data = await fs.readFile(path.join(process.cwd(), 'src/app/landlord/landlords-data.json'), 'utf-8');
        return JSON.parse(data);
    } catch(e) {
        return [];
    }
}

async function readProperties() {
    try {
        const data = await fs.readFile(propertiesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch(e) {
        return [];
    }
}

async function readTenancyContracts(): Promise<TenancyContract[]> {
    try {
        const data = await fs.readFile(tenancyContractsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch(e) {
        return [];
    }
}

export async function getLookups() {
    const landlords = await readLandlords();
    const properties = await readProperties();
    const tenancyContracts = await readTenancyContracts();

    const propertiesMap = new Map(properties.map((p: any) => [(p.propertyData || p).name, (p.propertyData || p).landlordCode]));

    return {
        landlords: landlords.map((l:any) => ({ value: l.landlordData.code, label: l.landlordData.name })),
        properties: properties.map((p:any) => ({ value: (p.propertyData || p).name, label: (p.propertyData || p).name })),
        tenancyContracts: tenancyContracts.map((c: any) => ({ 
            value: c.contractNo, 
            label: `${c.contractNo} (${c.tenantName})`,
            landlordCode: c.property ? propertiesMap.get(c.property) : undefined,
            property: c.property
        })),
    }
}

export async function getContractDetails(contractNo: string) {
    const allTenancyContracts = await readTenancyContracts();
    const contract = allTenancyContracts.find(c => c.contractNo === contractNo);

    if (!contract) {
        return { success: false, error: 'Tenancy contract not found' };
    }
    
    const allProperties = await readProperties();
    const property = allProperties.find(p => (p.propertyData || p).name === contract.property);

    if (!property) {
        return { success: true, data: { tenantName: contract.tenantName, property: contract.property, totalRent: contract.totalRent } };
    }

    const landlordCode = (property.propertyData || property).landlordCode;

    return { success: true, data: {
        tenantName: contract.tenantName,
        property: contract.property,
        landlordCode: landlordCode,
        totalRent: contract.totalRent
    }}
}
