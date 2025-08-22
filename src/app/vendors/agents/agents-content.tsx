
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List } from 'lucide-react';
import { AgentGrid } from './agent-grid';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Agent } from './schema';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { type Payment } from '@/app/finance/payment/schema';

export function AgentContent({ agents }: { agents: Agent[] }) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = React.useState('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
  const [paymentDefaultValues, setPaymentDefaultValues] = React.useState<Partial<Omit<Payment, 'id'>> | undefined>();

  const filteredAgents = React.useMemo(() => {
    if (!filter) {
      return agents;
    }
    return agents.filter(agent =>
      agent.name.toLowerCase().includes(filter.toLowerCase()) ||
      (agent.vendorName && agent.vendorName.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [agents, filter]);

  const handleRecordPayment = (agent: Agent) => {
    setPaymentDefaultValues({
      type: 'Payment',
      partyType: 'Vendor',
      partyName: agent.name,
      amount: agent.commissionRate,
      remarks: `Commission payment for agent ${agent.name} (${agent.code})`,
      agentCode: agent.code,
      status: 'Paid',
    });
    setIsPaymentDialogOpen(true);
  };
  
  const handlePaymentAdded = () => {
    // This would ideally trigger a refresh of the agents data.
    // For now, we rely on page navigation/refresh.
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Filter by agent or vendor name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center rounded-md bg-muted p-1">
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {viewMode === 'list' ? (
        <DataTable columns={columns(handleRecordPayment)} data={filteredAgents} />
      ) : (
        <AgentGrid agents={filteredAgents} />
      )}
       {isPaymentDialogOpen && (
            <AddPaymentDialog
                isOpen={isPaymentDialogOpen}
                setIsOpen={setIsPaymentDialogOpen}
                defaultValues={paymentDefaultValues}
                onPaymentAdded={handlePaymentAdded}
            />
        )}
    </>
  );
}
