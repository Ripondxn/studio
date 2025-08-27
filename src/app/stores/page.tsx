
import { getStores } from './actions';
import { StoresClient } from './stores-client';


export default async function StoresPage() {
  const initialStores = await getStores();
  return (
    <StoresClient initialStores={initialStores} />
  );
}
