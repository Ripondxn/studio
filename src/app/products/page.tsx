import { ProductsClient } from './products-client';
import { getProducts } from './actions';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Products & Services</h1>
          <p className="text-muted-foreground">
            Manage your catalog of items and services.
          </p>
        </div>
      </div>
      <ProductsClient initialProducts={products} />
    </div>
  );
}
