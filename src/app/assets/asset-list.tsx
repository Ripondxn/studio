
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { type Asset } from './schema';

export function AssetList({ initialAssets, onAssetUpdate }: { initialAssets: Asset[], onAssetUpdate: () => void }) {
  const [assets, setAssets] = useState(initialAssets);
  
  useEffect(() => {
    setAssets(initialAssets);
  }, [initialAssets]);

  return <DataTable columns={columns({ onAssetUpdate })} data={assets} />;
}

    