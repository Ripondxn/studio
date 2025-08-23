
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, DatabaseBackup, Upload, Settings, Save } from 'lucide-react';
import { saveBackupSettings, type BackupSettings } from './actions';
import { format } from 'date-fns';

export function BackupClient({ initialSettings }: { initialSettings: BackupSettings }) {
    const { toast } = useToast();
    const [settings, setSettings] = useState<BackupSettings>(initialSettings);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [restoreFile, setRestoreFile] = useState<File | null>(null);

    const handleBackup = async () => {
        setIsBackingUp(true);
        try {
            const response = await fetch('/api/backup/create', { method: 'POST' });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.zip`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                toast({
                    title: 'Backup Created',
                    description: 'Your data has been successfully backed up.',
                });
            } else {
                 const errorData = await response.json();
                 throw new Error(errorData.error || 'Failed to create backup.');
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Backup Error',
                description: (error as Error).message,
            });
        }
        setIsBackingUp(false);
    };

    const handleRestore = async () => {
        if (!restoreFile) {
            toast({
                variant: 'destructive',
                title: 'No File Selected',
                description: 'Please select a backup file to restore.',
            });
            return;
        }

        setIsRestoring(true);
        const formData = new FormData();
        formData.append('backupFile', restoreFile);
        
        try {
             const response = await fetch('/api/backup/restore', {
                method: 'POST',
                body: formData,
            });
            
            if (response.ok) {
                toast({
                    title: 'Restore Successful',
                    description: 'Your data has been restored from the backup.',
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to restore backup.');
            }
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Restore Error',
                description: (error as Error).message,
            });
        }

        setIsRestoring(false);
        setRestoreFile(null);
    };

    const handleSettingsSave = async () => {
        setIsSaving(true);
        const result = await saveBackupSettings(settings);
        if (result.success) {
            toast({
                title: 'Settings Saved',
                description: 'Your backup settings have been updated.',
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        }
        setIsSaving(false);
    }
    
    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-3xl space-y-8">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold font-headline">Backup & Restore</h1>
                    <p className="text-muted-foreground">Manage your application's data backups.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Manual Backup & Restore</CardTitle>
                        <CardDescription>Create an immediate backup or restore from a previous file.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-medium mb-2">Create Backup</h3>
                            <p className="text-sm text-muted-foreground mb-4">Download a zip file of all your current application data.</p>
                            <Button onClick={handleBackup} disabled={isBackingUp}>
                                {isBackingUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DatabaseBackup className="mr-2 h-4 w-4" />}
                                {isBackingUp ? 'Creating Backup...' : 'Create Backup Now'}
                            </Button>
                        </div>
                        <div className="border-t pt-6">
                             <h3 className="font-medium mb-2">Restore from Backup</h3>
                             <p className="text-sm text-muted-foreground mb-4">
                                Upload a `.zip` backup file to restore your application data.
                                <span className="font-bold text-destructive"> This will overwrite all current data.</span>
                             </p>
                             <div className="flex gap-4">
                                <Input type="file" accept=".zip" onChange={(e) => setRestoreFile(e.target.files ? e.target.files[0] : null)} />
                                <Button onClick={handleRestore} disabled={isRestoring || !restoreFile} variant="destructive">
                                    {isRestoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    {isRestoring ? 'Restoring...' : 'Restore'}
                                </Button>
                             </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Automatic Backup Settings</CardTitle>
                        <CardDescription>Configure scheduled daily backups. <span className="font-semibold text-primary">(Note: Requires server-side cron job setup to be fully functional)</span></CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="automatic-backups" className="text-base">Enable Automatic Backups</Label>
                                <p className="text-sm text-muted-foreground">
                                    When enabled, a backup will be created automatically every day.
                                </p>
                            </div>
                            <Switch
                                id="automatic-backups"
                                checked={settings.automaticBackupsEnabled}
                                onCheckedChange={(checked) => setSettings(s => ({...s, automaticBackupsEnabled: checked}))}
                            />
                        </div>
                        <div className={`space-y-2 ${!settings.automaticBackupsEnabled && 'opacity-50'}`}>
                            <Label htmlFor="backup-time">Backup Time</Label>
                            <Input
                                id="backup-time"
                                type="time"
                                className="w-[180px]"
                                value={settings.backupTime}
                                onChange={(e) => setSettings(s => ({...s, backupTime: e.target.value}))}
                                disabled={!settings.automaticBackupsEnabled}
                            />
                             <p className="text-xs text-muted-foreground">The time of day (UTC) when the automatic backup should run.</p>
                        </div>
                    </CardContent>
                     <CardFooter>
                         <Button onClick={handleSettingsSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                             Save Settings
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
