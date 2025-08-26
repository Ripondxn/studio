'use client';

import { useState, useEffect } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { type Product } from './schema';

export function ProductList({ initialProducts, onProductUpdate }: { initialProducts: Product[], onProductUpdate: () => void }) {
  const [products, setProducts] = useState(initialProducts);
  
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  return <DataTable columns={columns({ onProductUpdate })} data={products} />;
}
