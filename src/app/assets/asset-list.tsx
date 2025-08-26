
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { type Asset } from './schema';
import { getAssets } from './actions';

export function AssetList({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState(initialAssets);

  const refreshAssets = async () => {
    const updatedAssets = await getAssets();
    setAssets(updatedAssets);
  };
  
  useEffect(() => {
    setAssets(initialAssets);
  }, [initialAssets]);

  return <DataTable columns={columns({ onAssetUpdate: refreshAssets })} data={assets} />;
}
