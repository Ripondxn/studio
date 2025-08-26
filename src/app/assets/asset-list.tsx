
'use client';

import { useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { type Asset } from './schema';

export function AssetList({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState(initialAssets);

  // Placeholder for future actions
  const refreshAssets = () => {
    // This function will re-fetch asset data
    console.log('Refreshing assets...');
  };

  return <DataTable columns={columns({ onAssetUpdate: refreshAssets })} data={assets} />;
}
