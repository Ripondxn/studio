
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChequeBookClient } from './cheque-book-client';
import { ReceiptBookClient } from './receipt-book-client';
import { getBooks } from './actions';
import { type ChequeBook, type ReceiptBook } from './schema';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/app/admin/user-roles/schema';

export default function BookManagementPage() {
    const [chequeBooks, setChequeBooks] = useState<ChequeBook[]>([]);
    const [receiptBooks, setReceiptBooks] = useState<ReceiptBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        const result = await getBooks();
        if(result.success) {
            setChequeBooks(result.data.chequeBooks);
            setReceiptBooks(result.data.receiptBooks);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            const profile: { role: UserRole['role'] } = JSON.parse(storedProfile);
            if (['Super Admin', 'Admin', 'Accountant'].includes(profile.role)) {
                setIsAuthorized(true);
                fetchBooks();
            } else {
                router.push('/');
            }
        } else {
            router.push('/login');
        }
    }, [router, fetchBooks]);

    if (!isAuthorized) {
      return (
        <div className="flex h-full w-full items-center justify-center p-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      );
    }
    

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Book Management</h1>
                    <p className="text-muted-foreground">
                        Manage your cheque books and receipt books.
                    </p>
                </div>
            </div>
            
            <Tabs defaultValue="cheque-book">
                <TabsList>
                    <TabsTrigger value="cheque-book">Cheque Book</TabsTrigger>
                    <TabsTrigger value="receipt-book">Receipt Book</TabsTrigger>
                </TabsList>
                <TabsContent value="cheque-book">
                    <ChequeBookClient 
                        initialBooks={chequeBooks} 
                        onSuccess={fetchBooks}
                        isLoading={isLoading}
                    />
                </TabsContent>
                <TabsContent value="receipt-book">
                    <ReceiptBookClient
                        initialBooks={receiptBooks}
                        onSuccess={fetchBooks}
                        isLoading={isLoading}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
