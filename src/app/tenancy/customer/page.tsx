
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllCustomers } from './actions';
import { CustomerContent } from './customer-content';
import { Customer } from './schema';

export default async function CustomersPage() {
  const customers: Customer[] = await getAllCustomers();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Customers</h1>
            <p className="text-muted-foreground">Manage customer profiles and interactions.</p>
        </div>
        <Button asChild>
          <Link href="/tenancy/customer/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Customer
          </Link>
        </Button>
      </div>
      <CustomerContent customers={customers} />
    </div>
  );
}
