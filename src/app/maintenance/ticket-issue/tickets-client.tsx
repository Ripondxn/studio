
'use client';

import { useState, useEffect } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddTicketDialog } from './add-ticket-dialog';
import { type MaintenanceTicket } from './schema';
import { getTickets } from './actions';

export function MaintenanceTicketsClient({ initialTickets }: { initialTickets: MaintenanceTicket[] }) {
  const [tickets, setTickets] = useState(initialTickets);

  // This effect can be used to re-fetch tickets if you need real-time updates after adding.
  const handleTicketAdded = async () => {
    const updatedTickets = await getTickets();
    setTickets(updatedTickets);
  };
  
  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);


  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Maintenance Tickets</h1>
            <p className="text-muted-foreground">
                Track and manage all maintenance requests and issues.
            </p>
        </div>
        <div className="flex gap-2">
            <AddTicketDialog onTicketAdded={handleTicketAdded} />
        </div>
      </div>
      <DataTable columns={columns} data={tickets} />
    </div>
  );
}
