

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllAgents } from './actions';
import { AgentContent } from './agent-content';
import { Agent } from './schema';

export default async function AgentsPage() {
  const agents: Agent[] = await getAllAgents();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Agents</h1>
            <p className="text-muted-foreground">A list of all commission-based agents.</p>
        </div>
        <Button asChild>
          <Link href="/vendors/agents/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Agent
          </Link>
        </Button>
      </div>
      <AgentContent agents={agents} />
    </div>
  );
}
