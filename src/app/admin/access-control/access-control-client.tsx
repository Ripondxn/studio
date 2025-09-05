
"use client";

import { useState, useTransition } from 'react';
import ModuleManagement from './module-management';
import PermissionManagement from './permission-management';
import { type ModuleSettings, type Module, type Permission } from './schema';
import { saveModuleSettings } from './module-actions';

const roles = ["Super Admin", "Admin", "Property Manager", "Accountant", "User", "Developer"];

interface AccessControlClientProps {
  initialSettings: ModuleSettings;
  permissions: Permission[];
}

export default function AccessControlClient({ initialSettings, permissions }: AccessControlClientProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [isPending, startTransition] = useTransition();
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);

    const handleToggle = (moduleId: string) => {
        setSettings(prev => ({
            ...prev,
            [moduleId]: { ...prev[moduleId], enabled: !prev[moduleId].enabled }
        }));
    };

    const handleSaveChanges = () => {
        startTransition(async () => {
            const result = await saveModuleSettings(settings);
            if (result.success) {
                alert('Module settings saved successfully!');
            } else {
                alert(`Error saving settings: ${result.error}`);
            }
        });
    };

    const openPermissionDialog = (module: Module) => {
        setSelectedModule(module);
    };

    const closePermissionDialog = () => {
        setSelectedModule(null);
    };

    return (
        <>
            <ModuleManagement
                settings={settings}
                isPending={isPending}
                onToggle={handleToggle}
                onSaveChanges={handleSaveChanges}
                onManagePermissions={openPermissionDialog}
            />
            {selectedModule && (
                <PermissionManagement
                    module={selectedModule}
                    permissions={permissions}
                    roles={roles}
                    onOpenChange={closePermissionDialog}
                />
            )}
        </>
    );
}
