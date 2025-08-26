'use client';

import { useState, useEffect } from 'react';
import { ProductList } from './product-list';
import { AddProductDialog } from './add-product-dialog';
import { type Product } from './schema';
import { getProducts } from './actions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);

  const refreshProducts = async () => {
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
  };

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  return (
    <div>
        <div className="flex justify-end mb-4">
             <AddProductDialog onProductAdded={refreshProducts}>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New Item
                </Button>
            </AddProductDialog>
        </div>
        <ProductList initialProducts={products} onProductUpdate={refreshProducts} />
    </div>
  );
}
