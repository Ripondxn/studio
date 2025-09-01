
import { getPermissions, getRoles } from './actions';
import { AccessControlClient } from './access-control-client';
import { getModuleSettings } from './module-actions';
import { ModuleManagement } from './module-management';


export default async function AccessControlPage() {
  const permissions = await getPermissions();
  const roles = await getRoles();
  const moduleSettings = await getModuleSettings();

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
        initialPermissions={permissions}
        roles={roles}
      />
    </div>
  );
}
