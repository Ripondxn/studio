
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Database } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { getStorageSettings, saveStorageSettings, type StorageSettings } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';


const storageSettingsSchema = z.object({
    provider: z.enum(['local', 'google-drive']),
    googleDriveApiKey: z.string().optional(),
    enabled: z.boolean(),
});

type StorageFormData = z.infer<typeof storageSettingsSchema>;

function ExternalStorageClient({ initialSettings }: { initialSettings: StorageSettings }) {
    const { toast } = useToast();
    const form = useForm<StorageFormData>({
        resolver: zodResolver(storageSettingsSchema),
        defaultValues: {
            ...initialSettings,
            googleDriveApiKey: initialSettings.googleDriveApiKey || '', // Ensure defined value
        },
    });

    const {
        formState: { isSubmitting, isDirty },
        handleSubmit,
        control
    } = form;

    const onSubmit = async (data: StorageFormData) => {
        const result = await saveStorageSettings(data);
        if (result.success) {
            toast({
                title: 'Settings Saved',
                description: 'Your external storage settings have been updated.',
            });
            form.reset(data); // Reset dirty state
        } else {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mx-auto max-w-2xl space-y-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                            <Database className="h-8 w-8" /> External Storage
                        </h1>
                        <p className="text-muted-foreground">Configure where to store file attachments.</p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Storage Provider</CardTitle>
                            <CardDescription>Select and configure your file storage provider.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="enabled-switch" className="text-base">Enable External Storage</Label>
                                    <p className="text-sm text-muted-foreground">
                                       Turn this off to revert to storing files locally on the server.
                                    </p>
                                </div>
                                <Controller
                                    control={control}
                                    name="enabled"
                                    render={({ field }) => (
                                        <Switch
                                            id="enabled-switch"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Provider</Label>
                                <Controller
                                    control={control}
                                    name="provider"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch('enabled')}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a provider..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="local">Local Server Storage</SelectItem>
                                                <SelectItem value="google-drive">Google Drive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            {form.watch('provider') === 'google-drive' && (
                                <div className="p-4 border rounded-md space-y-4">
                                    <h4 className="font-semibold">Google Drive Configuration</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Note: Full integration requires server-side setup. This is a placeholder for API key storage.
                                    </p>
                                     <FormField
                                        control={form.control}
                                        name="googleDriveApiKey"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Google Drive API Key</Label>
                                                <FormControl><Input {...field} type="password" placeholder="Enter your Google Drive API key" disabled={!form.watch('enabled')} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                        </CardContent>
                        <CardFooter>
                             <Button type="submit" disabled={isSubmitting || !isDirty}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </Form>
    )
}

export default function ExternalStoragePage() {
  const [settings, setSettings] = useState<StorageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
        const storedProfile = sessionStorage.getItem('userProfile');
        if (storedProfile) {
            const profile: { role: UserRole['role'] } = JSON.parse(storedProfile);
            // Replace with actual permission check later
            if (profile.role === 'Developer' || profile.role === 'Super Admin') {
                setIsAuthorized(true);
                const settingsData = await getStorageSettings();
                setSettings(settingsData);
            } else {
                router.push('/');
            }
        } else {
             router.push('/login');
        }
        setIsLoading(false);
    };

    checkAuthAndFetchData();
  }, [router]);

  if (isLoading || !settings) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading Settings...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
         <div className="flex h-full w-full items-center justify-center p-10">
            <p className="text-muted-foreground">You are not authorized to view this page.</p>
        </div>
    )
  }
  
  return <ExternalStorageClient initialSettings={settings} />;
}
