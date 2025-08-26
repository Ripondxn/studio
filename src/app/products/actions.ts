'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { productSchema, type Product } from './schema';

const productsFilePath = path.join(process.cwd(), 'src/app/products/products-data.json');


async function readProducts(): Promise<Product[]> {
    try {
        await fs.access(productsFilePath);
        const data = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeProducts([]);
            return [];
        }
        throw error;
    }
}

async function writeProducts(data: Product[]) {
    await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getProducts(): Promise<Product[]> {
    return await readProducts();
}

const productFormSchema = productSchema.omit({ id: true });

export async function saveProduct(data: z.infer<typeof productFormSchema>, id?: string) {
    const validation = productFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data format.' };
    }

    try {
        const allProducts = await readProducts();
        
        if (id) { // Update existing
            const index = allProducts.findIndex(p => p.id === id);
            if(index === -1) return { success: false, error: 'Product not found.'};
            allProducts[index] = { ...allProducts[index], ...validation.data };
        } else { // Create new
            const newProduct: Product = {
                ...validation.data,
                id: `PROD-${Date.now()}`,
            };
            allProducts.push(newProduct);
        }

        await writeProducts(allProducts);
        revalidatePath('/products');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}


export async function deleteProduct(productId: string) {
     try {
        const allProducts = await readProducts();
        const updatedProducts = allProducts.filter(p => p.id !== productId);
        
        if (allProducts.length === updatedProducts.length) {
            return { success: false, error: 'Product not found.' };
        }

        await writeProducts(updatedProducts);
        revalidatePath('/products');
        return { success: true };

    } catch (error) {
        return { success: false, error: (error as Error).message || 'An unknown error occurred.' };
    }
}
