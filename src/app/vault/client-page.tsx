
'use client';

import { useEffect, useState, useMemo } from 'react';
import { getUserCredentials, deleteAccountCredential } from './actions';
import type { AccountCredential } from './schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface VaultClientPageProps {
  userId: string;
}

export default function VaultClientPage({ userId }: VaultClientPageProps) {
  const [credentials, setCredentials] = useState<AccountCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    async function loadCredentials() {
      setIsLoading(true);
      const result = await getUserCredentials(userId);
      if (result.success) {
        setCredentials(result.data || []);
      } else {
        setError(result.error || 'Failed to load credentials.');
      }
      setIsLoading(false);
    }
    loadCredentials();
  }, [userId]);

  const filteredCredentials = useMemo(() => {
    return credentials
      .filter(c => typeFilter === 'all' || c.accountType === typeFilter)
      .filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.username && c.username.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [credentials, searchTerm, typeFilter]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      const result = await deleteAccountCredential(id);
      if (result.success) {
        setCredentials(prev => prev.filter(c => c.id !== id));
      } else {
        alert(result.error);
      }
    }
  };

  const maskData = (data: string | undefined) => {
    if (!data) return 'N/A';
    if (data.length <= 4) return '****';
    return `****${data.slice(-4)}`;
  };

  const copyToClipboard = (text: string | undefined) => {
    if(text) {
        navigator.clipboard.writeText(text)
            .then(() => alert('Copied to clipboard!'))
            .catch(() => alert('Failed to copy.'));
    } else {
        alert("No data to copy.")
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <Input 
          placeholder="Search by title or username..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="bank">Bank</SelectItem>
            <SelectItem value="utility_water">Utility (Water)</SelectItem>
            <SelectItem value="utility_electricity">Utility (Electric)</SelectItem>
            <SelectItem value="subscription_elife">Subscription (eLife)</SelectItem>
            <SelectItem value="subscription_other">Subscription (Other)</SelectItem>
            <SelectItem value="telephone">Telephone</SelectItem>
            <SelectItem value="third_party">Third Party</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCredentials.map(cred => (
          <Card key={cred.id} className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="font-bold text-lg text-primary">{cred.title}</span>
                <Badge variant="secondary">{cred.accountType.replace('_', ' ')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Username/Email</p>
                <p className="font-mono">{cred.username || 'N/A'}</p>
              </div>
              {cred.accountNumber && (
                 <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                    <p className="font-mono">{maskData(cred.accountNumber)}</p>
                </div>
              )}
               <div>
                    <p className="text-sm font-medium text-muted-foreground">Password</p>
                    <p className="font-mono">********</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(cred.password)}>
                    <Copy className="h-4 w-4 mr-1" /> Copy Pass
                </Button>
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/vault/edit/${cred.id}`}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                    </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(cred.id!)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       {filteredCredentials.length === 0 && (
        <div className="text-center py-12">
            <h3 className="text-xl font-semibold">No Credentials Found</h3>
            <p className="text-muted-foreground mt-2">Get started by adding a new account credential.</p>
        </div>
      )}
    </div>
  );
}
