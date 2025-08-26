
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AssetList } from './asset-list';

export default async function AssetManagementPage() {
  // In the future, we'll fetch assets here.
  const assets: any[] = [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Asset Management</h1>
          <p className="text-muted-foreground">
            Track and manage your company's long-term and short-term assets.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Asset
        </Button>
      </div>
      <AssetList initialAssets={assets} />
    </div>
  );
}
