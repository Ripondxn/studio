
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAllLandlords } from './actions';
import { LandlordContent } from './landlord-content';
import { Landlord } from './schema';

export default async function LandlordsPage() {
  const landlords: Landlord[] = await getAllLandlords();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Landlords</h1>
        <Button asChild>
          <Link href="/landlord/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Landlord
          </Link>
        </Button>
      </div>
      <LandlordContent landlords={landlords} />
    </div>
  );
}
