
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { storeSchema, stockItemSchema, type Store, type StockItem, type StockTransaction } from './schema';
import { type Product } from '@/app/products/schema';

const storesFilePath = path.join(process.cwd(), 'src/app/stores/stores-data.json');
const stockFilePath = path.join(process.cwd(), 'src/app/stores/stock-data.json');
const stockTransactionsFilePath = path.join(process.cwd(), 'src/app/stores/stock-transactions.json');
const productsFilePath = path.join(process.cwd(), 'src/app/products/products-data.json');


async function readData<T>(filePath: string, defaultValue: T[] = []): Promise<T[]> {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
            return defaultValue;
        }
        throw error;
    }
}

async function writeData(filePath: string, data: any) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


// Store Actions
export async function getStores(): Promise<Store[]> {
    return await readData<Store>(storesFilePath);
}

export async function saveStore(data: Omit<Store, 'id'> & { id?: string }) {
    const validation = storeSchema.omit({id: true}).safeParse(data);
    if (!validation.success) return { success: false, error: 'Invalid data format.' };

    const stores = await getStores();
    if (data.id) { // Update
        const index = stores.findIndex(s => s.id === data.id);
        if (index === -1) return { success: false, error: 'Store not found.' };
        stores[index] = { ...stores[index], ...validation.data };
    } else { // Create
        const newStore: Store = { ...validation.data, id: `STORE-${Date.now()}` };
        stores.push(newStore);
    }

    await writeData(storesFilePath, stores);
    revalidatePath('/stores');
    return { success: true };
}

export async function deleteStore(storeId: string) {
    const stores = await getStores();
    const updatedStores = stores.filter(s => s.id !== storeId);
    if (stores.length === updatedStores.length) {
        return { success: false, error: 'Store not found.' };
    }
    await writeData(storesFilePath, updatedStores);
    revalidatePath('/stores');
    return { success: true };
}


// Stock Actions
export async function getStockForStore(storeId: string): Promise<StockItem[]> {
    const allStock = await readData<StockItem>(stockFilePath);
    const products = await readData<Product>(productsFilePath);
    const productMap = new Map(products.map(p => [p.id, p]));

    return allStock
        .filter(item => item.storeId === storeId)
        .map(item => ({
            ...item,
            itemName: productMap.get(item.productId)?.itemName || 'Unknown Item',
            itemCode: productMap.get(item.productId)?.itemCode || 'Unknown',
        }));
}

export async function getAggregatedStock(): Promise<any[]> {
    const allStock = await readData<StockItem>(stockFilePath);
    const products = await readData<Product>(productsFilePath);
    const stores = await getStores();

    const productMap = new Map(products.map(p => [p.id, p]));
    const storeMap = new Map(stores.map(s => [s.id, s]));
    
    const aggregatedStock = new Map<string, any>();

    for(const item of allStock) {
        if (!productMap.has(item.productId)) continue;

        if (!aggregatedStock.has(item.productId)) {
            const product = productMap.get(item.productId)!;
            aggregatedStock.set(item.productId, {
                productId: item.productId,
                itemName: product.itemName,
                itemCode: product.itemCode,
                totalQuantity: 0,
                locations: [],
            });
        }

        const aggItem = aggregatedStock.get(item.productId)!;
        aggItem.totalQuantity += item.quantity;
        aggItem.locations.push({
            storeName: storeMap.get(item.storeId)?.name || 'Unknown Store',
            quantity: item.quantity,
        });
    }

    return Array.from(aggregatedStock.values());
}


export async function getProductsForSelect(): Promise<{value: string, label: string}[]> {
    const products = await readData<Product>(productsFilePath);
    return products.map(p => ({ value: p.id, label: `${p.itemName} (${p.itemCode})`}));
}


// Transaction Actions
const transactionSchema = z.object({
    storeId: z.string(),
    productId: z.string(),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
    transactionType: z.enum(['IN', 'OUT']),
    notes: z.string().optional(),
    jobId: z.string().optional(),
});


export async function recordStockTransaction(data: z.infer<typeof transactionSchema>) {
    const validation = transactionSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    const { storeId, productId, quantity, transactionType, notes, jobId } = validation.data;
    
    // 1. Update Stock Level
    const allStock = await readData<StockItem>(stockFilePath);
    const stockItemIndex = allStock.findIndex(item => item.storeId === storeId && item.productId === productId);

    if (transactionType === 'IN') {
        if (stockItemIndex > -1) {
            allStock[stockItemIndex].quantity += quantity;
        } else {
            allStock.push({
                id: `STOCK-${Date.now()}`,
                storeId,
                productId,
                quantity,
            });
        }
    } else { // OUT
        if (stockItemIndex === -1 || allStock[stockItemIndex].quantity < quantity) {
            return { success: false, error: 'Insufficient stock for this transaction.' };
        }
        allStock[stockItemIndex].quantity -= quantity;
    }

    await writeData(stockFilePath, allStock);
    
    // 2. Record Transaction
    const allTransactions = await readData<StockTransaction>(stockTransactionsFilePath);
    const products = await readData<Product>(productsFilePath);
    const product = products.find(p => p.id === productId);
    const store = (await getStores()).find(s => s.id === storeId);
    
    const newTransaction: StockTransaction = {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString(),
        storeId,
        storeName: store?.name || 'Unknown Store',
        productId,
        productName: product?.itemName || 'Unknown Item',
        quantity,
        type: transactionType,
        notes,
        jobId
    };
    allTransactions.push(newTransaction);
    await writeData(stockTransactionsFilePath, allTransactions);

    // 3. Financial Impact
    const cost = product?.costPrice || 0;
    const value = quantity * cost;
    
    // This is a simplified financial integration.
    // A more robust system would create journal entries.
    const allAccounts = await readData<any>(path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json'));
    const inventoryAccountIndex = allAccounts.findIndex(a => a.code === '1140');
    const expenseAccountIndex = allAccounts.findIndex(a => a.code === '5140'); // Maintenance & Repairs

    if (transactionType === 'IN') {
        if (inventoryAccountIndex > -1) {
            allAccounts[inventoryAccountIndex].balance = (allAccounts[inventoryAccountIndex].balance || 0) + value;
        }
    } else { // OUT
        if (inventoryAccountIndex > -1) {
             allAccounts[inventoryAccountIndex].balance = (allAccounts[inventoryAccountIndex].balance || 0) - value;
        }
        if (expenseAccountIndex > -1) {
             allAccounts[expenseAccountIndex].balance = (allAccounts[expenseAccountIndex].balance || 0) + value;
        }
    }
    
    await writeData(path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json'), allAccounts);


    revalidatePath('/stores');
    revalidatePath('/finance/chart-of-accounts');
    return { success: true };
}

export async function getTransactionHistory(): Promise<StockTransaction[]> {
    return await readData<StockTransaction>(stockTransactionsFilePath);
}

const transferSchema = z.object({
  fromStoreId: z.string().min(1, 'Source store is required'),
  toStoreId: z.string().min(1, 'Destination store is required'),
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
}).refine(data => data.fromStoreId !== data.toStoreId, {
    message: "Source and destination stores cannot be the same.",
    path: ['toStoreId'],
});

export async function transferStock(data: z.infer<typeof transferSchema>) {
    const validation = transferSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: validation.error.errors[0].message };
    }

    const { fromStoreId, toStoreId, productId, quantity, notes } = validation.data;
    
    const allStock = await readData<StockItem>(stockFilePath);
    const sourceStockIndex = allStock.findIndex(item => item.storeId === fromStoreId && item.productId === productId);
    
    // Check for sufficient stock
    if (sourceStockIndex === -1 || allStock[sourceStockIndex].quantity < quantity) {
        return { success: false, error: 'Insufficient stock in the source store.' };
    }

    // Decrement from source
    allStock[sourceStockIndex].quantity -= quantity;

    // Increment in destination
    const destinationStockIndex = allStock.findIndex(item => item.storeId === toStoreId && item.productId === productId);
    if (destinationStockIndex > -1) {
        allStock[destinationStockIndex].quantity += quantity;
    } else {
        allStock.push({ id: `STOCK-${Date.now()}`, storeId: toStoreId, productId, quantity });
    }

    await writeData(stockFilePath, allStock);
    
    // Record transactions
    const allTransactions = await readData<StockTransaction>(stockTransactionsFilePath);
    const stores = await getStores();
    const products = await readData<Product>(productsFilePath);
    const fromStoreName = stores.find(s => s.id === fromStoreId)?.name || 'Unknown';
    const toStoreName = stores.find(s => s.id === toStoreId)?.name || 'Unknown';
    const productName = products.find(p => p.id === productId)?.itemName || 'Unknown';
    const transferRef = `TRN-${Date.now()}`;

    allTransactions.push({
        id: `TXN-${Date.now()}-OUT`,
        date: new Date().toISOString(),
        storeId: fromStoreId,
        storeName: fromStoreName,
        productId,
        productName,
        quantity,
        type: 'OUT',
        notes: `Transfer to ${toStoreName}. Ref: ${transferRef}. ${notes || ''}`,
    });

    allTransactions.push({
        id: `TXN-${Date.now()}-IN`,
        date: new Date().toISOString(),
        storeId: toStoreId,
        storeName: toStoreName,
        productId,
        productName,
        quantity,
        type: 'IN',
        notes: `Transfer from ${fromStoreName}. Ref: ${transferRef}. ${notes || ''}`,
    });

    await writeData(stockTransactionsFilePath, allTransactions);

    revalidatePath('/stores');
    return { success: true };
}


export async function deleteStockTransaction(transactionId: string) {
    const allTransactions = await readData<StockTransaction>(stockTransactionsFilePath);
    const transactionToDelete = allTransactions.find(t => t.id === transactionId);

    if (!transactionToDelete) {
        return { success: false, error: "Transaction not found." };
    }
    
    // Reverse stock level
    const allStock = await readData<StockItem>(stockFilePath);
    const stockItemIndex = allStock.findIndex(item => item.storeId === transactionToDelete.storeId && item.productId === transactionToDelete.productId);

    if (stockItemIndex > -1) {
        if (transactionToDelete.type === 'IN') {
            allStock[stockItemIndex].quantity -= transactionToDelete.quantity;
        } else { // OUT
            allStock[stockItemIndex].quantity += transactionToDelete.quantity;
        }
        await writeData(stockFilePath, allStock);
    }

    // Reverse financial impact
    const products = await readData<Product>(productsFilePath);
    const product = products.find(p => p.id === transactionToDelete.productId);
    const cost = product?.costPrice || 0;
    const value = transactionToDelete.quantity * cost;
    const allAccounts = await readData<any>(path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json'));
    const inventoryAccountIndex = allAccounts.findIndex(a => a.code === '1140');
    const expenseAccountIndex = allAccounts.findIndex(a => a.code === '5140');

    if (transactionToDelete.type === 'IN') {
        if (inventoryAccountIndex > -1) {
            allAccounts[inventoryAccountIndex].balance -= value;
        }
    } else { // OUT
        if (inventoryAccountIndex > -1) {
             allAccounts[inventoryAccountIndex].balance += value;
        }
        if (expenseAccountIndex > -1) {
             allAccounts[expenseAccountIndex].balance -= value;
        }
    }
    await writeData(path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json'), allAccounts);

    // Remove transaction log
    const updatedTransactions = allTransactions.filter(t => t.id !== transactionId);
    await writeData(stockTransactionsFilePath, updatedTransactions);
    
    revalidatePath('/stores');
    revalidatePath('/finance/chart-of-accounts');
    return { success: true };
}
