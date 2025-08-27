
'use client';

import { useState, useEffect } from 'react';
import { AddStoreDialog } from './add-store-dialog';
import { type Store } from './schema';
import { getStores, getAggregatedStock } from './actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Building, MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { StockManagement } from './stock-management';
import { deleteStore } from './actions';
import { useToast } from '@/hooks/use-toast';
import { GlobalStockView } from './global-stock-view';

const StoreCard = ({ store, onEdit, onDelete }: { store: Store, onEdit: (store: Store) => void, onDelete: (storeId: string) => void }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete the store "{store.name}". This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(store.id)} className="bg-destructive hover:bg-destructive/90">
                           Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>{store.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-2">
                            <MapPin className="h-4 w-4" /> {store.location || 'No location specified'}
                        </CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => onEdit(store)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent>
                    <StockManagement store={store} />
                </CardContent>
            </Card>
        </>
    );
}


export function StoresClient({ initialStores }: { initialStores: Store[] }) {
  const [stores, setStores] = useState(initialStores);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | undefined>(undefined);
  const { toast } = useToast();
  
  useEffect(() => {
    setStores(initialStores);
  }, [initialStores]);

  const refreshStores = async () => {
    const updatedStores = await getStores();
    setStores(updatedStores);
  };
  
  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setIsDialogOpen(true);
  }
  
  const handleDelete = async (storeId: string) => {
    const result = await deleteStore(storeId);
    if(result.success) {
        toast({ title: "Store Deleted", description: "The store location has been removed." });
        refreshStores();
    } else {
        toast({ variant: 'destructive', title: "Error", description: result.error });
    }
  }

  return (
     <div className="container mx-auto py-10">
        <AddStoreDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            store={selectedStore}
            onSuccess={() => {
                refreshStores();
                setSelectedStore(undefined);
            }}
        />
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Vaults & Stores</h1>
                <p className="text-muted-foreground">
                    Manage your inventory across all locations.
                </p>
            </div>
             <Button onClick={() => { setSelectedStore(undefined); setIsDialogOpen(true); }}>
                Add New Store
            </Button>
        </div>
        
        <div className="mb-8">
            <GlobalStockView />
        </div>

        {stores.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Stores Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first store or vault location.</p>
            </div>
        ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {stores.map(store => (
                    <StoreCard key={store.id} store={store} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
            </div>
        )}
    </div>
  );
}
