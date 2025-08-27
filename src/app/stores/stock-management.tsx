
'use client';

import { useState, useEffect } from 'react';
import { type Store, type StockItem } from './schema';
import { getStockForStore } from './actions';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, History, Loader2, RotateCcw } from 'lucide-react';
import { StockInDialog } from './stock-in-dialog';
import { StockOutDialog } from './stock-out-dialog';
import { TransactionHistoryDialog } from './transaction-history-dialog';

export function StockManagement({ store }: { store: Store }) {
    const [stock, setStock] = useState<StockItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isStockInOpen, setIsStockInOpen] = useState(false);
    const [isStockOutOpen, setIsStockOutOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const refreshStock = async () => {
        setIsLoading(true);
        const stockData = await getStockForStore(store.id);
        setStock(stockData);
        setIsLoading(false);
    }
    
    useEffect(() => {
        refreshStock();
    }, [store.id]);

    return (
        <div>
             <div className="flex gap-2 mb-4">
                <Button size="sm" onClick={() => setIsStockInOpen(true)}><ArrowDown className="mr-2 h-4 w-4" /> Stock In</Button>
                <Button size="sm" variant="secondary" onClick={() => setIsStockOutOpen(true)}><ArrowUp className="mr-2 h-4 w-4"/> Stock Out</Button>
                 <Button size="sm" variant="outline" onClick={() => setIsHistoryOpen(true)}><History className="mr-2 h-4 w-4" /> History</Button>
                 <Button size="icon" variant="ghost" onClick={refreshStock}><RotateCcw className="h-4 w-4"/></Button>
            </div>
            <StockInDialog isOpen={isStockInOpen} setIsOpen={setIsStockInOpen} store={store} onSuccess={refreshStock} />
            <StockOutDialog isOpen={isStockOutOpen} setIsOpen={setIsStockOutOpen} store={store} onSuccess={refreshStock} />
            <TransactionHistoryDialog isOpen={isHistoryOpen} setIsOpen={setIsHistoryOpen} />
            {isLoading ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="h-6 w-6 animate-spin"/></div>
            ) : (
                <DataTable columns={columns} data={stock} storeName={store.name} />
            )}
        </div>
    )
}
