
import { VaultForm } from '../form';

export default function AddCredentialPage() {
  // Hardcoded for now, will be replaced with actual logged-in user
  const userId = 'user_123'; 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-primary mb-6 font-headline">Add New Account Credential</h1>
      <VaultForm userId={userId} />
    </div>
  );
}
