
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, KeyRound } from 'lucide-react';
import { saveLicenseSettings, getLicenseSettings, type LicenseSettings } from './actions';

function LicenseSettingsClient({ initialSettings }: { initialSettings: LicenseSettings }) {
    const { toast } = useToast();
    const [settings, setSettings] = useState<LicenseSettings>(initialSettings);
    const [isSaving, setIsSaving] = useState(false);

    const handleSettingsSave = async () => {
        setIsSaving(true);
        const result = await saveLicenseSettings(settings);
        if (result.success) {
            toast({
                title: 'Settings Saved',
                description: 'Your license settings have been updated.',
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
            <div className="mx-auto max-w-2xl space-y-8">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><KeyRound className="h-8 w-8" /> License Settings</h1>
                    <p className="text-muted-foreground">Control the application's trial period and licensing.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Time-Limited Trial</CardTitle>
                        <CardDescription>
                            Enable or disable the 30-day trial period check.
                        </CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="trial-check" className="text-base">Enable Trial Period Check</Label>
                                <p className="text-sm text-muted-foreground">
                                    When enabled, the application will lock after the 30-day trial expires. 
                                    When disabled, the application will remain fully functional.
                                </p>
                            </div>
                            <Switch
                                id="trial-check"
                                checked={settings.trialCheckEnabled}
                                onCheckedChange={(checked) => setSettings(s => ({...s, trialCheckEnabled: checked}))}
                            />
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


export default function LicenseSettingsPage() {
  const [settings, setSettings] = useState<LicenseSettings | null>(null);
  
  useEffect(() => {
    getLicenseSettings().then(setSettings);
  }, []);

  if (!settings) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading Settings...</span>
        </div>
      </div>
    );
  }
  
  return <LicenseSettingsClient initialSettings={settings} />;
}
