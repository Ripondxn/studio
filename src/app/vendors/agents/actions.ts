
'use server';

import { promises as fs } from 'fs';
import path from 'path';

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

export async function getAllAgents() {
    const vendors = await getVendors();
    
    // Filter out vendors that have an agent and map to the agent details
    const agents = vendors
        .filter((v: any) => v.vendorData && v.vendorData.agentName)
        .map((v: any) => ({
            code: v.vendorData.agentCode,
            name: v.vendorData.agentName,
            mobile: v.vendorData.agentMobile,
            email: v.vendorData.agentEmail,
            commission: v.vendorData.agentCommission,
            vendorName: v.vendorData.name,
            vendorCode: v.vendorData.code
        }));

    return agents;
}
