
import { getPermissions, getRoles, getUserOverrides } from './actions';
import { AccessControlClient } from './access-control-client';
import { getModuleSettings } from './module-actions';
import { ModuleManagement } from './module-management';
import { UserPermissionOverrides } from './user-permission-overrides';
import { getUsers } from '../user-roles/actions';
import { AccessControlGuide } from './access-control-guide';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';


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
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                 <CardTitle>Role-Based Feature Permissions</CardTitle>
                <CardDescription>
                    Assign specific feature access to user roles. This is the primary permission layer.
                </CardDescription>
            </div>
            <AccessControlGuide />
        </CardHeader>
        <AccessControlClient
            initialPermissions={permissions}
            roles={roles}
        />
      </Card>
    </div>
  );
}
