
export default function StoresPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                <h1 className="text-3xl font-bold font-headline">Vaults & Stores</h1>
                <p className="text-muted-foreground">
                    Manage your inventory across all locations.
                </p>
                </div>
            </div>
            {/* The client component for stores will be added here */}
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Store Management Dashboard Coming Soon</p>
            </div>
        </div>
    );
}
