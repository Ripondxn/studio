

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
        if(p.type === 'Payment' && p.agentCode) {
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


const addAgentFormSchema = agentSchema.omit({
  id: true,
  code: true,
  vendorCode: true,
  vendorName: true,
});

export async function addAgent(data: z.infer<typeof addAgentFormSchema>) {
    const validation = addAgentFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format for adding agent.' };
    }

    try {
        const allAgents = await readAgents();
        
        let maxAgentNum = 0;
        allAgents.forEach((a: any) => {
            const agentCodeMatch = a.code?.match(/^A(\d+)$/);
             if (agentCodeMatch) {
                const num = parseInt(agentCodeMatch[1], 10);
                if (num > maxAgentNum) maxAgentNum = num;
            }
        });
        const newAgentCode = `A${(maxAgentNum + 1).toString().padStart(3, '0')}`;
        
        const newAgent: Agent = {
            id: `AGENT-${Date.now()}`,
            code: newAgentCode,
            ...validation.data,
        }

        allAgents.push(newAgent);
        await writeAgents(allAgents);
        
        revalidatePath('/vendors/agents');

        return { success: true };
    } catch (error) {
        console.error('Failed to add agent:', error);
        return { success: false, error: (error as Error).message || 'An unknown error occurred' };
    }
}

const updateAgentSchema = agentSchema.omit({ totalCommissionPaid: true });

export async function updateAgentData(data: z.infer<typeof updateAgentSchema>) {
    const validation = updateAgentSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format for agent update.' };
    }

    try {
        const allAgents = await readAgents();
        const agentIndex = allAgents.findIndex((a: any) => a.code === data.code);

        if (agentIndex === -1) {
            return { success: false, error: 'Agent not found.' };
        }

        allAgents[agentIndex] = { ...allAgents[agentIndex], ...validation.data };
        
        await writeAgents(allAgents);
        revalidatePath('/vendors/agents');

        return { success: true, data: allAgents[agentIndex] };
    } catch (error) {
        console.error('Failed to update agent data:', error);
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
