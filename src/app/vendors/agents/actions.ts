
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Payment } from '@/app/finance/payment/schema';

const vendorsFilePath = path.join(process.cwd(), 'src/app/vendors/vendors-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');


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

async function getPayments(): Promise<Payment[]> {
     try {
        await fs.access(paymentsFilePath);
        const data = await fs.readFile(paymentsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export async function getAllAgents() {
    const vendors = await getVendors();
    const payments = await getPayments();
    
    const commissionPaidMap = new Map<string, number>();

    payments.forEach(p => {
        if(p.type === 'Payment' && p.agentCode) {
            const currentPaid = commissionPaidMap.get(p.agentCode) || 0;
            commissionPaidMap.set(p.agentCode, currentPaid + p.amount);
        }
    });

    // Filter out vendors that have an agent and map to the agent details
    const agents = vendors
        .filter((v: any) => v.vendorData && v.vendorData.agentName)
        .map((v: any) => ({
            code: v.vendorData.agentCode,
            name: v.vendorData.agentName,
            mobile: v.vendorData.agentMobile,
            email: v.vendorData.agentEmail,
            commissionRate: v.vendorData.agentCommission,
            totalCommissionPaid: commissionPaidMap.get(v.vendorData.agentCode) || 0,
            vendorName: v.vendorData.name,
            vendorCode: v.vendorData.code,
        }));

    return agents;
}
