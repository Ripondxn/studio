
import { getModuleSettings } from './module-actions';
import ModuleManagement from './module-management';
import PermissionManagement from './permission-management'; // Correctly named component
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';


export default async function AccessControlPage() {
  const moduleSettings = await getModuleSettings();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Access Control Management</h1>
        <p className="text-muted-foreground">
          A two-layered approach to application security: first, enable or disable entire modules, then assign granular permissions for the features within them.
        </p>
      </div>
      
      {/* Component to Enable/Disable entire modules */}
      <ModuleManagement initialSettings={moduleSettings} />
      
      {/* Component to manage granular, role-based permissions */}
      <PermissionManagement />

    </div>
  );
}

