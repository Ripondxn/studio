
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Users, Trash2 } from 'lucide-react';
import { type ModuleSettings } from './schema';
import { type UserRole } from '../user-roles/schema';
import { type UserOverride, saveUserOverrides } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface UserPermissionOverridesProps {
    initialUsers: UserRole[];
    initialModules: ModuleSettings;
    initialOverrides: UserOverride[];
}

export function UserPermissionOverrides({ initialUsers, initialModules, initialOverrides }: UserPermissionOverridesProps) {
    const [overrides, setOverrides] = React.useState<UserOverride[]>(initialOverrides);
    const [selectedUserEmail, setSelectedUserEmail] = React.useState<string>('');
    const [isSaving, setIsSaving] = React.useState(false);
    const { toast } = useToast();
    
    const selectedUserOverride = React.useMemo(() => {
        return overrides.find(o => o.email === selectedUserEmail);
    }, [overrides, selectedUserEmail]);

    const handleModuleToggle = (moduleId: string, checked: boolean) => {
        if (!selectedUserEmail) return;

        setOverrides(prev => {
            const newOverrides = [...prev];
            let userOverride = newOverrides.find(o => o.email === selectedUserEmail);

            if (!userOverride) {
                userOverride = { email: selectedUserEmail, allowedModules: [] };
                newOverrides.push(userOverride);
            }

            if (checked) {
                userOverride.allowedModules = [...new Set([...userOverride.allowedModules, moduleId])];
            } else {
                userOverride.allowedModules = userOverride.allowedModules.filter(id => id !== moduleId);
            }
            return newOverrides;
        });
    }
    
    const handleRemoveOverride = () => {
        if (!selectedUserEmail) return;
        setOverrides(prev => prev.filter(o => o.email !== selectedUserEmail));
        toast({ title: "Override Removed", description: `Custom permissions for ${selectedUserEmail} have been cleared. They will now use their role permissions.` });
    }

    const handleSave = async () => {
        setIsSaving(true);
        const result = await saveUserOverrides(overrides);
        if (result.success) {
            toast({ title: 'Overrides Saved', description: 'User-specific permissions have been updated.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsSaving(false);
    }
    
    const moduleList = Object.values(initialModules);

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Permission Overrides</CardTitle>
                <CardDescription>
                    Optionally set module access for a specific user, which will override their role permissions.
                    If no modules are checked for a user, they will default to their role's access.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center gap-4">
                    <Users className="h-5 w-5" />
                     <Select onValueChange={setSelectedUserEmail} value={selectedUserEmail}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select a user to override permissions..." />
                        </SelectTrigger>
                        <SelectContent>
                            {initialUsers.map(user => (
                                <SelectItem key={user.id} value={user.email}>{user.name} ({user.email})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     {selectedUserOverride && (
                        <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={handleRemoveOverride}>
                            <Trash2 className="mr-2 h-4 w-4" /> Clear Override
                        </Button>
                    )}
                 </div>
                 {selectedUserEmail && (
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-4">Grant access to the following modules for {selectedUserEmail}:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {moduleList.map(module => (
                                <div key={module.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${module.id}-${selectedUserEmail}`}
                                        checked={selectedUserOverride?.allowedModules.includes(module.id) || false}
                                        onCheckedChange={(checked) => handleModuleToggle(module.id, !!checked)}
                                    />
                                    <Label htmlFor={`${module.id}-${selectedUserEmail}`}>{module.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                     Save Overrides
                </Button>
            </CardFooter>
        </Card>
    )
}
