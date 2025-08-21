
import { getTickets } from './actions';
import { MaintenanceTicketsClient } from './tickets-client';


export default async function MaintenanceTicketsPage() {
  const tickets = await getTickets();

  return (
    <MaintenanceTicketsClient initialTickets={tickets} />
  );
}
