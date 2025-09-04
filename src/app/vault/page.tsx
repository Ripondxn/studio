
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VaultClientPage from './client-page';

export default function VaultPage() {

  // Hardcoded for now, will be replaced with actual logged-in user
  const userId = 'user_123'; 

  return (
    <div className="container mx-auto p-4 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary font-headline">My Accounts Vault</h1>
        <Button asChild>
          <Link href="/vault/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Account
          </Link>
        </Button>
      </div>
      <VaultClientPage userId={userId} />
    </div>
  );
}
