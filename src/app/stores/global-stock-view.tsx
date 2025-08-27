
'use client';

import { useState, useEffect } from 'react';
import { getAggregatedStock } from './actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface AggregatedStockItem {
    productId: string;
    itemName: string;
    itemCode: string;
    totalQuantity: number;
    locations: {
        storeName: string;
        quantity: number;
    }[];
}

export function GlobalStockView() {
    const [stock, setStock] = useState<AggregatedStockItem[]>([]);
    const [filteredStock, setFilteredStock] = useState<AggregatedStockItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        getAggregatedStock().then(data => {
            setStock(data);
            setFilteredStock(data);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        const lowercasedFilter = filter.toLowerCase();
        const filteredData = stock.filter(item => 
            item.itemName.toLowerCase().includes(lowercasedFilter) ||
            item.itemCode.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredStock(filteredData);
    }, [filter, stock]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Global Stock View</CardTitle>
                <CardDescription>An aggregated view of all items across all stores.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Input 
                        placeholder="Filter by item name or code..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                 {isLoading ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="h-6 w-6 animate-spin"/></div>
                ) : (
                    <div className="h-96 overflow-y-auto border rounded-md">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background">
                                <TableRow>
                                    <TableHead>Item Code</TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead className="text-right">Total Quantity</TableHead>
                                    <TableHead>Locations</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStock.length > 0 ? filteredStock.map(item => (
                                    <TableRow key={item.productId}>
                                        <TableCell>{item.itemCode}</TableCell>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell className="text-right font-bold">{item.totalQuantity}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                            {item.locations.map(loc => (
                                                <Badge key={loc.storeName} variant="secondary">
                                                    {loc.storeName}: {loc.quantity}
                                                </Badge>
                                            ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">No stock found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
