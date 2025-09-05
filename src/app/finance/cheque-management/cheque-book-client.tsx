
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { columns } from './cheque-book-columns';
import { AddChequeBookDialog } from './add-cheque-book-dialog';
import { type ChequeBook } from './schema';
import { Loader2 } from 'lucide-react';

interface ChequeBookClientProps {
    initialBooks: ChequeBook[];
    onSuccess: () => void;
    isLoading: boolean;
}

export function ChequeBookClient({ initialBooks, onSuccess, isLoading }: ChequeBookClientProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsAddDialogOpen(true)}>Add Cheque Book</Button>
            </div>
            <DataTable columns={columns} data={initialBooks} />
            <AddChequeBookDialog
                isOpen={isAddDialogOpen}
                setIsOpen={setIsAddDialogOpen}
                onSuccess={onSuccess}
            />
        </div>
    );
}
