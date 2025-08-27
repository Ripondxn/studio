
'use client';

import { useState, useEffect } from 'react';
import { AssetList } from './asset-list';
import { AddAssetDialog } from './add-asset-dialog';
import { type Asset } from './schema';
import { getAssets } from './actions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AssetsClient({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState(initialAssets);

  const refreshAssets = async () => {
    const updatedAssets = await getAssets();
    setAssets(updatedAssets);
  };

  useEffect(() => {
    setAssets(initialAssets);
  }, [initialAssets]);

  return (
    <div>
        <div className="flex justify-end mb-4 no-print">
             <AddAssetDialog onAssetAdded={refreshAssets}>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New Asset
                </Button>
            </AddAssetDialog>
        </div>
        <div id="printable-area">
          <AssetList initialAssets={assets} onAssetUpdate={refreshAssets} />
        </div>
    </div>
  );
}

    