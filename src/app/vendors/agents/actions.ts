

'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { type Payment } from '@/app/finance/payment/schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { agentSchema, type Agent } from './schema';

const agentsFilePath = path.join(process.cwd(), 'src/app/vendors/agents/agents-data.json');
const paymentsFilePath = path.join(process.cwd(), 'src/app/finance/payment/payments-data.json');


async function readAgents(): Promise<Agent[]> {
    try {
        await fs.access(agentsFilePath);
        const data = await fs.readFile(agentsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeAgents([]);
            return [];
        }
        throw error;
    }
}

async function writeAgents(data: Agent[]) {
    await fs.writeFile(agentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
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
    const agents = await readAgents();
    const payments = await getPayments();
    
    const commissionPaidMap = new Map<string, number>();

    payments.forEach(p => {
        if(p.type === 'Payment' && p.currentStatus === 'POSTED' && p.agentCode) {
            const currentPaid = commissionPaidMap.get(p.agentCode) || 0;
            commissionPaidMap.set(p.agentCode, currentPaid + p.amount);
        }
    });

    return agents.map(agent => ({
        ...agent,
        totalCommissionPaid: commissionPaidMap.get(agent.code) || 0,
    }));
}

export async function getPaymentsForAgent(agentCode: string): Promise<Payment[]> {
    const allPayments = await getPayments();
    const agentPayments = allPayments.filter(
        (p) => p.agentCode === agentCode && p.type === 'Payment'
    );
    return agentPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function findAgentData(agentCode: string) {
  try {
    const allAgents = await readAgents();
    
    if (agentCode === 'new') {
        let maxAgentNum = 0;
        allAgents.forEach((a: any) => {
            const agentCodeMatch = a.code?.match(/^A(\d+)$/);
             if (agentCodeMatch) {
                const num = parseInt(agentCodeMatch[1], 10);
                if (num > maxAgentNum) maxAgentNum = num;
            }
        });
        const newAgentCode = `A${(maxAgentNum + 1).toString().padStart(4, '0')}`;
        return { success: true, data: { code: newAgentCode } };
    }

    const agent = allAgents.find((a: any) => a.code === agentCode);

    if (agent) {
       return { success: true, data: agent };
    } else {
       return { success: false, error: "Not Found" };
    }
  } catch (error) {
    console.error('Failed to find agent data:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred' };
  }
}

export async function saveAgentData(data: Agent, isNewRecord: boolean) {
    try {
        const allAgents = await readAgents();
        let savedData: Agent;

        if (isNewRecord) {
            const newAgent = { ...data, id: `AGENT-${Date.now()}` };
            const validation = agentSchema.safeParse(newAgent);
            if (!validation.success) {
                return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
            }
            allAgents.push(validation.data);
            savedData = validation.data;
        } else {
            const validation = agentSchema.safeParse(data);
            if (!validation.success) {
                return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
            }
            const index = allAgents.findIndex(a => a.id === data.id);
            if (index !== -1) {
                allAgents[index] = { ...allAgents[index], ...validation.data };
                savedData = allAgents[index];
            } else {
                return { success: false, error: 'Agent not found.' };
            }
        }
        
        await writeAgents(allAgents);
        revalidatePath('/vendors/agents');

        return { success: true, data: savedData };
    } catch (error) {
        console.error('Failed to save agent data:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}


export async function deleteAgent(agentCode: string) {
    if (!agentCode) {
        return { success: false, error: 'Agent code is required.' };
    }

    try {
        const allAgents = await readAgents();
        const updatedAgents = allAgents.filter((a: any) => a.code !== agentCode);

        if (allAgents.length === updatedAgents.length) {
            return { success: false, error: 'Agent not found.' };
        }
        
        await writeAgents(updatedAgents);
        revalidatePath('/vendors/agents');

        return { success: true };
    } catch (error) {
        console.error('Failed to delete agent:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}
