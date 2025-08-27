
import { getAllMaintenanceContracts } from './actions';
import { MaintenanceContractsClient } from './maintenance-contracts-client';

export default async function MaintenanceContractsPage() {
  const contracts = await getAllMaintenanceContracts();

  return (
    <div className="container mx-auto py-10">
      <MaintenanceContractsClient initialContracts={contracts} />
    </div>
  );
}
