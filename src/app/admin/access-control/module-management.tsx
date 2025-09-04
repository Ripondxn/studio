
"use client";

import { useState, useTransition } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type ModuleSettings } from './schema';
import { saveModuleSettings } from './module-actions';

interface ModuleManagementProps {
  initialSettings: ModuleSettings;
}

export default function ModuleManagement({ initialSettings }: ModuleManagementProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [isPending, startTransition] = useTransition();

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
                alert('Module settings saved successfully! The application will now reflect the changes.');
            } else {
                alert(`Error saving settings: ${result.error}`);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Module Management</CardTitle>
                <CardDescription>
                    Enable or disable entire application modules. Disabling a module will hide it for all users, regardless of their role.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.values(settings).map((module) => (
                        <div key={module.id} className="flex items-center space-x-2 rounded-md border p-4">
                            <Switch
                                id={module.id}
                                checked={module.enabled}
                                onCheckedChange={() => handleToggle(module.id)}
                                disabled={isPending}
                            />
                            <Label htmlFor={module.id} className="flex-grow">{module.name}</Label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={handleSaveChanges} disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Module Settings'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
