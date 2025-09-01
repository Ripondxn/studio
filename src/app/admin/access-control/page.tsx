
import { getPermissions, getRoles } from './actions';
import { AccessControlClient } from './access-control-client';
import { featurePermissions } from './permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CarFront, Briefcase, Users, Package, Home, Warehouse } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';


export default async function AccessControlPage() {
  const savedPermissions = await getPermissions();
  const roles = await getRoles();

  // Merge saved permissions with the default structure to ensure all features are listed
  const allPermissions = featurePermissions.map(feature => {
    const savedFeature = savedPermissions.find(p => p.feature === feature.feature);
    const actions = feature.actions.map(action => {
      const savedAction = savedFeature?.actions.find(a => a.action === action.action);
      return {
        ...action,
        allowedRoles: savedAction ? savedAction.allowedRoles : action.allowedRoles,
      };
    });
    return {
      ...feature,
      actions,
    };
  });

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Access Control Management</h1>
        <p className="text-muted-foreground">
          Define which user roles can access specific features and perform key actions across the application.
        </p>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Module Management</CardTitle>
            <CardDescription>Enable or disable major application modules.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                    <Users className="h-6 w-6 text-primary" />
                    <div className="space-y-0.5">
                        <Label htmlFor="tenant-module" className="text-base">Tenant Module</Label>
                        <p className="text-sm text-muted-foreground">
                            Manage tenants and their contracts.
                        </p>
                    </div>
                </div>
                <Switch
                    id="tenant-module"
                    defaultChecked={true} 
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                    <Users className="h-6 w-6 text-blue-400" />
                    <div className="space-y-0.5">
                        <Label htmlFor="customer-module" className="text-base">Customer Module</Label>
                        <p className="text-sm text-muted-foreground">
                            Manage general customers and service invoicing.
                        </p>
                    </div>
                </div>
                <Switch
                    id="customer-module"
                    defaultChecked={true} 
                />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                    <Package className="h-6 w-6 text-primary" />
                    <div className="space-y-0.5">
                        <Label htmlFor="products-module" className="text-base">Products & Services Module</Label>
                        <p className="text-sm text-muted-foreground">
                            Manage your catalog of items and services.
                        </p>
                    </div>
                </div>
                <Switch
                    id="products-module"
                    defaultChecked={true} 
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <div className="space-y-0.5">
                        <Label htmlFor="asset-management-module" className="text-base">Asset Management Module</Label>
                        <p className="text-sm text-muted-foreground">
                            Track and manage company assets and depreciation.
                        </p>
                    </div>
                </div>
                <Switch
                    id="asset-management-module"
                    defaultChecked={true} 
                />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <div className="space-y-0.5">
                        <Label htmlFor="project-management-module" className="text-base">Project Management Module</Label>
                        <p className="text-sm text-muted-foreground">
                            Enable or disable the entire Project Management module.
                        </p>
                    </div>
                </div>
                <Switch
                    id="project-management-module"
                    defaultChecked={true} 
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                    <CarFront className="h-6 w-6 text-primary" />
                    <div className="space-y-0.5">
                        <Label htmlFor="rent-a-car-module" className="text-base">Rent-A-Car Module</Label>
                        <p className="text-sm text-muted-foreground">
                            Enable or disable the entire Rent-A-Car module.
                        </p>
                    </div>
                </div>
                <Switch
                    id="rent-a-car-module"
                    defaultChecked={true} 
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                    <Warehouse className="h-6 w-6 text-primary" />
                    <div className="space-y-0.5">
                        <Label htmlFor="stores-module" className="text-base">Vaults & Stores Module</Label>
                        <p className="text-sm text-muted-foreground">
                            Manage inventory and stock across locations.
                        </p>
                    </div>
                </div>
                <Switch
                    id="stores-module"
                    defaultChecked={true} 
                />
            </div>
        </CardContent>
      </Card>
      
      <AccessControlClient
        initialPermissions={allPermissions}
        roles={roles}
      />
    </div>
  );
}
