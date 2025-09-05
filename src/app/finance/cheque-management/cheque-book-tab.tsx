
'use client';

import { useState, useEffect } from 'react';
import { getChequeBooks } from './actions';
import { type ChequeBook } from './schema';
import { ChequeBookClient } from './cheque-book-client';

interface ChequeBookTabProps {
    onSuccess: () => void;
}

export function ChequeBookTab({ onSuccess }: ChequeBookTabProps) {
    const [initialBooks, setInitialBooks] = useState<ChequeBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const books = await getChequeBooks();
            setInitialBooks(books);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const handleSuccessAndReload = () => {
        onSuccess();
        async function fetchData() {
            setIsLoading(true);
            const books = await getChequeBooks();
            setInitialBooks(books);
            setIsLoading(false);
        }
        fetchData();
    }

    return <ChequeBookClient initialBooks={initialBooks} onSuccess={handleSuccessAndReload} isLoading={isLoading} />;
}
