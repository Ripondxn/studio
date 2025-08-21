

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { vendorSchema } from './schema';
import { z } from 'zod';

const vendorsFilePath = path.join(process.cwd(), 'src/app/vendors/vendors-data.json');

async function getVendors() {
    try {
        await fs.access(vendorsFilePath);
        const data = await fs.readFile(vendorsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // Return empty array if file doesn't exist
        }
        throw error;
    }
}

async function writeVendors(data: any) {
    await fs.writeFile(vendorsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getAllVendors() {
    const vendors = await getVendors();
    // The list page expects a flat structure for each vendor, plus attachments.
    return vendors.map((v: any) => ({
        ...v.vendorData,
        attachments: v.attachments || []
    }));
}

export async function saveVendorData(dataToSave: any, isNewRecord: boolean) {
  try {
    const allVendors = await getVendors();
    const { code } = dataToSave.vendorData;

    if (isNewRecord) {
        const vendorExists = allVendors.some((v: any) => v.vendorData.code === code);
        if (vendorExists) {
            return { success: false, error: `Vendor with code "${code}" already exists.` };
        }
        const newVendor = {
            id: `V-${Date.now()}`,
            ...dataToSave
        };
        allVendors.push(newVendor);
    } else {
        const index = allVendors.findIndex((v: any) => v.vendorData.code === code);

        if (index !== -1) {
            allVendors[index] = {
                ...allVendors[index],
                ...dataToSave,
                id: allVendors[index].id // Preserve original ID
            };
        } else {
            return { success: false, error: `Vendor with code "${code}" not found.` };
        }
    }
    
    await writeVendors(allVendors);
    revalidatePath('/vendors');

    return { success: true };
  } catch (error) {
    console.error('Failed to save vendor data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function findVendorData(vendorCode: string) {
  try {
    const allVendors = await getVendors();
    
    if (vendorCode === 'new') {
        let maxVendorNum = 0;
        allVendors.forEach((v: any) => {
            const vendorCodeMatch = v.vendorData.code?.match(/^V(\d+)$/);
            if (vendorCodeMatch) {
                const num = parseInt(vendorCodeMatch[1], 10);
                if (num > maxVendorNum) maxVendorNum = num;
            }
        });
        const newVendorCode = `V${(maxVendorNum + 1).toString().padStart(3, '0')}`;
        return { success: true, data: { vendorData: { code: newVendorCode } } };
    }

    const vendor = allVendors.find((v: any) => v.vendorData.code === vendorCode);

    if (vendor) {
       return { success: true, data: vendor };
    } else {
       return { success: false, error: "Not Found" };
    }
  } catch (error) {
    console.error('Failed to find vendor data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function deleteVendorData(vendorCode: string) {
    try {
        const allVendors = await getVendors();
        const updatedVendors = allVendors.filter((v: any) => v.vendorData.code !== vendorCode);

        if (allVendors.length === updatedVendors.length) {
            return { success: false, error: 'Vendor not found.' };
        }

        await writeVendors(updatedVendors);
        revalidatePath('/vendors');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete vendor data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

const updateAgentSchema = z.object({
  vendorCode: z.string(),
  agentCode: z.string().optional(),
  agentName: z.string().optional(),
  agentMobile: z.string().optional(),
  agentEmail: z.string().email().optional().or(z.literal('')),
  agentCommission: z.coerce.number().optional(),
});


export async function updateAgentData(data: z.infer<typeof updateAgentSchema>) {
    const validation = updateAgentSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format for agent update.' };
    }

    try {
        const allVendors = await getVendors();
        const vendorIndex = allVendors.findIndex((v: any) => v.vendorData.code === data.vendorCode);

        if (vendorIndex === -1) {
            return { success: false, error: 'Associated vendor not found.' };
        }

        // Update only the agent fields
        allVendors[vendorIndex].vendorData = {
            ...allVendors[vendorIndex].vendorData,
            agentCode: data.agentCode,
            agentName: data.agentName,
            agentMobile: data.agentMobile,
            agentEmail: data.agentEmail,
            agentCommission: data.agentCommission,
        };
        
        await writeVendors(allVendors);
        revalidatePath('/vendors/agents');
        revalidatePath(`/vendors/add?code=${data.vendorCode}`);

        return { success: true, data: allVendors[vendorIndex] };
    } catch (error) {
        console.error('Failed to update agent data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

const addAgentSchema = z.object({
  vendorCode: z.string().min(1, "Please select a vendor."),
  agentName: z.string().min(1, "Agent name is required."),
  agentMobile: z.string().optional(),
  agentEmail: z.string().email().optional().or(z.literal('')),
  agentCommission: z.coerce.number().optional(),
});


export async function addAgent(data: z.infer<typeof addAgentSchema>) {
    const validation = addAgentSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format for adding agent.' };
    }

    try {
        const allVendors = await getVendors();
        const vendorIndex = allVendors.findIndex((v: any) => v.vendorData.code === data.vendorCode);

        if (vendorIndex === -1) {
            return { success: false, error: 'Associated vendor not found.' };
        }
        
        if (allVendors[vendorIndex].vendorData.agentName) {
            return { success: false, error: `Vendor "${allVendors[vendorIndex].vendorData.name}" already has an agent.`}
        }

        let maxAgentNum = 0;
        allVendors.forEach((v: any) => {
            const agentCodeMatch = v.vendorData.agentCode?.match(/^A(\d+)$/);
             if (agentCodeMatch) {
                const num = parseInt(agentCodeMatch[1], 10);
                if (num > maxAgentNum) maxAgentNum = num;
            }
        });
        const newAgentCode = `A${(maxAgentNum + 1).toString().padStart(3, '0')}`;

        // Update only the agent fields
        allVendors[vendorIndex].vendorData = {
            ...allVendors[vendorIndex].vendorData,
            agentCode: newAgentCode,
            agentName: data.agentName,
            agentMobile: data.agentMobile,
            agentEmail: data.agentEmail,
            agentCommission: data.agentCommission,
        };
        
        await writeVendors(allVendors);
        revalidatePath('/vendors/agents');

        return { success: true };
    } catch (error) {
        console.error('Failed to add agent:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}
