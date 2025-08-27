

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

export async function getProductsForSelect(): Promise<{value: string, label: string}[]> {
    const products = await readData<Product>(productsFilePath);
    return products.map(p => ({ value: p.id, label: `${p.itemName} (${p.itemCode})`}));
}


// Transaction Actions
const transactionSchema = z.object({
    storeId: z.string(),
    productId: z.string(),
    quantity: z.number().min(1, 'Quantity must be at least 1.'),
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
    const allAccounts = await readData<Account>(path.join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json'));
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
