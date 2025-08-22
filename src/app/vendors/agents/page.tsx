

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllAgents } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Agent } from './schema';
import { AddAgentDialog } from './add-agent-dialog';
import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { type Payment } from '@/app/finance/payment/schema';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentDefaultValues, setPaymentDefaultValues] = useState<Partial<Omit<Payment, 'id'>> | undefined>();

  const refreshAgents = useCallback(async () => {
    const updatedAgents = await getAllAgents();
    setAgents(updatedAgents);
  }, []);

  useEffect(() => {
    refreshAgents();
  }, [refreshAgents]);


  const handleRecordPayment = (agent: Agent) => {
    setPaymentDefaultValues({
      type: 'Payment',
      partyType: 'Vendor',
      partyName: agent.vendorName,
      amount: agent.commission,
      remarks: `Commission payment for agent ${agent.name} (${agent.code})`,
      agentCode: agent.code,
      status: 'Paid',
    });
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentAdded = () => {
    refreshAgents();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Agents</h1>
            <p className="text-muted-foreground">A list of all agents associated with your vendors.</p>
        </div>
        <AddAgentDialog onSuccess={refreshAgents}/>
      </div>
      <DataTable columns={columns(handleRecordPayment)} data={agents} />
       {isPaymentDialogOpen && (
            <AddPaymentDialog
                isOpen={isPaymentDialogOpen}
                setIsOpen={setIsPaymentDialogOpen}
                defaultValues={paymentDefaultValues}
                onPaymentAdded={handlePaymentAdded}
            />
        )}
    </div>
  );
}
