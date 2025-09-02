
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, CarFront, Briefcase, Users, Package, Home, Warehouse, Wrench, Route, ScanLine, Lightbulb, Banknote, UserSquare, FileSignature, Car, Settings as SettingsIcon } from 'lucide-react';
import { type ModuleSettings } from './schema';
import { saveModuleSettings } from './module-actions';
import { useRouter } from 'next/navigation';
import { FinanceSettingsDialog } from './finance-settings-dialog';


const moduleIcons: { [key: string]: React.ReactNode } = {
  'lease': <FileSignature className="h-6 w-6 text-primary" />,
  'finance': <Banknote className="h-6 w-6 text-primary" />,
  'tenant': <Users className="h-6 w-6 text-primary" />,
  'customer': <Users className="h-6 w-6 text-blue-400" />,
  'vendor': <UserSquare className="h-6 w-6 text-primary" />,
  'products': <Package className="h-6 w-6 text-primary" />,
  'asset-management': <Briefcase className="h-6 w-6 text-primary" />,
  'maintenance': <Wrench className="h-6 w-6 text-primary" />,
  'project-management': <Briefcase className="h-6 w-6 text-primary" />,
  'human-resource': <Users className="h-6 w-6 text-primary" />,
  'rent-a-car': <CarFront className="h-6 w-6 text-primary" />,
  'car-sales': <Car className="h-6 w-6 text-primary" />,
  'stores': <Warehouse className="h-6 w-6 text-primary" />,
  'workflow': <Route className="h-6 w-6 text-primary" />,
  'data-processing': <ScanLine className="h-6 w-6 text-primary" />,
  'utilities': <Lightbulb className="h-6 w-6 text-primary" />,
  'settings': <SettingsIcon className="h-6 w-6 text-primary" />,
};

const moduleDescriptions: { [key: string]: string } = {
    'lease': 'Manage properties, landlords, and lease contracts.',
    'finance': 'Manage all financial transactions and accounts.',
    'tenant': 'Manage tenants and their contracts.',
    'customer': 'Manage general customers and service invoicing.',
    'vendor': 'Manage vendors, suppliers, and their bills.',
    'products': 'Manage your catalog of items and services.',
    'asset-management': 'Track and manage company assets and depreciation.',
    'maintenance': 'Manage maintenance tickets and service contracts.',
    'project-management': 'Enable or disable the entire Project Management module.',
    'human-resource': 'Manage employee profiles, documents, leaves, and compensation.',
    'rent-a-car': 'Enable or disable the entire Rent-A-Car module.',
    'car-sales': 'Manage vehicle buying and selling operations.',
    'stores': 'Manage inventory and stock across locations.',
    'workflow': 'Manage document approval workflows.',
    'data-processing': 'Extract data from uploaded documents.',
    'utilities': 'Manage utility accounts and bill payments.',
    'settings': 'Manage global application settings.'
};


export function ModuleManagement({ initialSettings }: { initialSettings: ModuleSettings }) {
    const [settings, setSettings] = React.useState(initialSettings);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isFinanceDialogOpen, setIsFinanceDialogOpen] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleToggle = (moduleId: string, checked: boolean) => {
        setSettings(prev => ({
            ...prev,
            [moduleId]: { ...prev[moduleId], enabled: checked }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await saveModuleSettings(settings);
        if (result.success) {
            toast({ title: "Settings Saved", description: "Module visibility settings have been updated. The sidebar will update shortly."});
            // Hard reload to make sure context is re-evaluated everywhere
            window.location.reload();
        } else {
             toast({ variant: 'destructive', title: "Error", description: result.error });
        }
        setIsSaving(false);
    }
    
    const renderSettingsButton = (moduleId: string) => {
        const moduleIsEnabled = settings[moduleId]?.enabled;
        switch (moduleId) {
            case 'finance':
                return (
                    <FinanceSettingsDialog
                        isOpen={isFinanceDialogOpen}
                        setIsOpen={setIsFinanceDialogOpen}
                        onSave={() => { /* Logic to save finance settings */}}
                    >
                         <Button variant="outline" size="sm" disabled={!moduleIsEnabled}>
                            <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                        </Button>
                    </FinanceSettingsDialog>
                );
            // Add other cases for other modules here
            default:
                return <Button variant="outline" size="sm" disabled>No Settings</Button>;
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Module Management</CardTitle>
                <CardDescription>
                  Globally enable or disable major application modules. Disabling a module here will hide it from the sidebar and block access for ALL users, regardless of their role.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {Object.values(settings).map(module => (
                     <div key={module.id} className="flex flex-col justify-between rounded-lg border p-4">
                        <div className="flex items-start gap-4">
                            {moduleIcons[module.id] || <Home className="h-6 w-6 text-primary" />}
                            <div className="flex-1 space-y-1">
                                <Label htmlFor={module.id} className="text-base font-semibold">{module.name}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {moduleDescriptions[module.id] || `Enable or disable the ${module.name}.`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                             {renderSettingsButton(module.id)}
                            <Switch
                                id={module.id}
                                checked={module.enabled}
                                onCheckedChange={(checked) => handleToggle(module.id, checked)}
                                disabled={module.id === 'settings'}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                     Save Module Settings
                </Button>
            </CardFooter>
      </Card>
    )
}
