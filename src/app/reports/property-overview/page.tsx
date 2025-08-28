
import { getPropertyOverview } from './actions';
import { PropertyOverviewClient } from './client';

export default async function PropertyOverviewPage() {
  const properties = await getPropertyOverview();
  
  return <PropertyOverviewClient initialProperties={properties} />;
}
