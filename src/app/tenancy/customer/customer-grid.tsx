
'use client';

import { CustomerCard } from './customer-card';
import { type Customer } from './schema';

interface CustomerGridProps {
  customers: Customer[];
}

export function CustomerGrid({ customers }: CustomerGridProps) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No customers found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {customers.map(customer => (
        <CustomerCard key={customer.code} customer={customer} />
      ))}
    </div>
  );
}
