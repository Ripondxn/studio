
import { getPermissions, getRoles, getUserOverrides } from './actions';
import { AccessControlClient } from './access-control-client';
import { getModuleSettings } from './module-actions';
import { ModuleManagement } from './module-management';
import { UserPermissionOverrides } from './user-permission-overrides';
import { getUsers } from '../user-roles/actions';


export default async function AccessControlPage() {
  const permissions = await getPermissions();
  const roles = await getRoles();
  const moduleSettings = await getModuleSettings();
  const users = await getUsers();
  const userOverrides = await getUserOverrides();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Access Control Management</h1>
        <p className="text-muted-foreground">
          Control which user roles can access specific application features and modules.
        </p>
      </div>
      
      <ModuleManagement initialSettings={moduleSettings} />
      
      <UserPermissionOverrides 
        initialUsers={users}
        initialModules={moduleSettings}
        initialOverrides={userOverrides}
      />
      
      <AccessControlClient
        initialPermissions={permissions}
        roles={roles}
      />
    </div>
  );
}
