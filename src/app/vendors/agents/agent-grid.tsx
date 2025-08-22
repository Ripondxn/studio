
'use client';

import { AgentCard } from './agent-card';
import type { Agent } from './schema';

interface AgentGridProps {
  agents: Agent[];
}

export function AgentGrid({ agents }: AgentGridProps) {
  if (agents.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No agents found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {agents.map(agent => (
        <AgentCard key={agent.code} agent={agent} />
      ))}
    </div>
  );
}
