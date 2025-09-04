
import { VaultForm } from '../../form';
import { getUserCredentials } from '../../actions';

interface EditCredentialPageProps {
  params: { id: string };
}

export default async function EditCredentialPage({ params }: EditCredentialPageProps) {
  
  // This is a simplified fetch, in a real app you'd get the specific item
  const { data: credentials } = await getUserCredentials('user_123');
  const credential = credentials?.find(c => c.id === params.id);

  if (!credential) {
    return <div className="container mx-auto p-4">Credential not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-primary mb-6 font-headline">Edit Account Credential</h1>
      <VaultForm userId={credential.userId} isEditMode={true} initialData={credential} />
    </div>
  );
}
