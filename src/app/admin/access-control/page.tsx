
import { getPermissions, getRoles } from './actions';
import { AccessControlClient } from './access-control-client';
import { featurePermissions } from './permissions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getModuleSettings } from './module-actions';
import { ModuleManagement } from './module-management';


export default async function AccessControlPage() {
  const savedPermissions = await getPermissions();
  const roles = await getRoles();
  const moduleSettings = await getModuleSettings();

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
      
      <ModuleManagement initialSettings={moduleSettings} />
      
      <AccessControlClient
        initialPermissions={allPermissions}
        roles={roles}
      />
    </div>
  );
}
