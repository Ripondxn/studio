

import { getAllAgents } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Agent } from './schema';
import { AddAgentDialog } from './add-agent-dialog';


export default async function AgentsPage() {
  const agents: Agent[] = await getAllAgents();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Agents</h1>
            <p className="text-muted-foreground">A list of all agents associated with your vendors.</p>
        </div>
        <AddAgentDialog />
      </div>
      <DataTable columns={columns} data={agents} />
    </div>
  );
}

