
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from './cheque-book-data-table';
import { columns } from './cheque-book-columns';
import { type ChequeBook } from './schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddChequeBookDialog } from './add-cheque-book-dialog';

interface ChequeBookClientProps {
    initialBooks: ChequeBook[];
    onSuccess: () => void;
    isLoading: boolean;
}

export function ChequeBookClient({ initialBooks, onSuccess, isLoading }: ChequeBookClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<ChequeBook | undefined>(undefined);

  const handleEdit = (book: ChequeBook) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  }

  const handleAdd = () => {
    setSelectedBook(undefined);
    setIsDialogOpen(true);
  }

  return (
    <div>
        <div className="flex justify-end mb-4">
             <AddChequeBookDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                book={selectedBook}
                onSuccess={onSuccess}
             />
             <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" /> Add Cheque Book
            </Button>
        </div>
        <DataTable columns={columns({ onEdit: handleEdit })} data={initialBooks} isLoading={isLoading} />
    </div>
  );
}
