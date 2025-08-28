
'use client';

import { useState } from 'react';
import { DataTable } from './receipt-book-data-table';
import { columns } from './receipt-book-columns';
import { type ReceiptBook } from './schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddReceiptBookDialog } from './add-receipt-book-dialog';

interface ReceiptBookClientProps {
    initialBooks: ReceiptBook[];
    onSuccess: () => void;
    isLoading: boolean;
}

export function ReceiptBookClient({ initialBooks, onSuccess, isLoading }: ReceiptBookClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<ReceiptBook | undefined>(undefined);

  const handleEdit = (book: ReceiptBook) => {
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
             <AddReceiptBookDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                book={selectedBook}
                onSuccess={onSuccess}
             />
             <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" /> Add Receipt Book
            </Button>
        </div>
        <DataTable columns={columns({ onEdit: handleEdit })} data={initialBooks} isLoading={isLoading} />
    </div>
  );
}
