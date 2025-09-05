
"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type ModuleSettings, type Module } from './schema';

interface ModuleManagementProps {
  settings: ModuleSettings;
  isPending: boolean;
  onToggle: (moduleId: string) => void;
  onSaveChanges: () => void;
  onManagePermissions: (module: Module) => void;
}

export default function ModuleManagement({ 
    settings, 
    isPending, 
    onToggle, 
    onSaveChanges, 
    onManagePermissions 
}: ModuleManagementProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Module Management</CardTitle>
                <CardDescription>
                    Enable or disable entire application modules. Disabling a module will hide it for all users, regardless of their role.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(settings).map((module) => (
                        <div key={module.id} className="rounded-md border p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={module.id}
                                    checked={module.enabled}
                                    onCheckedChange={() => onToggle(module.id)}
                                    disabled={isPending}
                                />
                                <Label htmlFor={module.id} className="flex-grow font-semibold">{module.name}</Label>
                            </div>
                            <p className="text-sm text-gray-500">{module.description}</p>
                            <Button variant="outline" size="sm" onClick={() => onManagePermissions(module)}>
                                Manage Permissions
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={onSaveChanges} disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Module Settings'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
