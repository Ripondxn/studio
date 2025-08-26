
import { getAssets } from './actions';
import { AssetsClient } from './assets-client';

export default async function AssetManagementPage() {
  const assets = await getAssets();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Asset Management</h1>
          <p className="text-muted-foreground">
            Track and manage your company's long-term and short-term assets.
          </p>
        </div>
      </div>
      <AssetsClient initialAssets={assets} />
    </div>
  );
}
