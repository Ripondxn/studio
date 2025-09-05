
import { promises as fs } from 'fs';
import path from 'path';
import AccessControlClient from './access-control-client';
import { type ModuleSettings, type Permission } from './schema';

async function getPermissions(): Promise<Permission[]> {
  const filePath = path.join(process.cwd(), 'src', 'app', 'admin', 'access-control', 'permissions.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

async function getModuleSettings(): Promise<ModuleSettings> {
  const filePath = path.join(process.cwd(), 'src', 'app', 'admin', 'access-control', 'module-settings.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export default async function AccessControlPage() {
  const [moduleSettings, permissions] = await Promise.all([
    getModuleSettings(),
    getPermissions(),
  ]);

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Access Control Management</h1>
        <p className="text-muted-foreground">
          A two-layered approach to application security: first, enable or disable entire modules, then assign granular permissions for the features within them.
        </p>
      </div>
      
      <AccessControlClient initialSettings={moduleSettings} permissions={permissions} />
    </div>
  );
}
