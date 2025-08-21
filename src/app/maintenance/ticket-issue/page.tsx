
import { getTickets } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddTicketDialog } from './add-ticket-dialog';


export default async function MaintenanceTicketsPage() {
  const tickets = await getTickets();

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
            <AddTicketDialog onTicketAdded={() => {}} />
        </div>
      </div>
      <DataTable columns={columns} data={tickets} />
    </div>
  );
}
