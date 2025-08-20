
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { getCommunicationSettings, saveCommunicationSettings } from './actions';

export default function CommunicationSettingsPage() {
    const { toast } = useToast();
    const [settings, setSettings] = useState({
        sendgridApiKey: '',
        twilioAccountSid: '',
        twilioAuthToken: '',
        twilioPhoneNumber: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getCommunicationSettings().then(result => {
            if (result.success && result.data) {
                setSettings(result.data);
            }
            setIsLoading(false);
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await saveCommunicationSettings(settings);
        if (result.success) {
            toast({
                title: 'Settings Saved',
                description: 'Your communication settings have been updated.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error || 'Failed to save settings.',
            });
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 flex justify-center items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-2xl">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold font-headline">Communication Settings</h1>
                    <p className="text-muted-foreground">Manage API keys for sending emails and SMS/WhatsApp messages.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Email Settings (SendGrid)</CardTitle>
                        <CardDescription>Configure settings for sending emails via SendGrid.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="sendgridApiKey">SendGrid API Key</Label>
                            <Input
                                id="sendgridApiKey"
                                name="sendgridApiKey"
                                type="password"
                                placeholder="SG.XXXXXXXXXXXXXXXX"
                                value={settings.sendgridApiKey}
                                onChange={handleInputChange}
                            />
                        </div>
                    </CardContent>
                    <Separator className="my-4" />
                    <CardHeader>
                        <CardTitle>SMS & WhatsApp Settings (Twilio)</CardTitle>
                        <CardDescription>Configure settings for sending messages via Twilio.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="twilioAccountSid">Twilio Account SID</Label>
                            <Input
                                id="twilioAccountSid"
                                name="twilioAccountSid"
                                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={settings.twilioAccountSid}
                                onChange={handleInputChange}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="twilioAuthToken">Twilio Auth Token</Label>
                            <Input
                                id="twilioAuthToken"
                                name="twilioAuthToken"
                                type="password"
                                placeholder="********************************"
                                value={settings.twilioAuthToken}
                                onChange={handleInputChange}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="twilioPhoneNumber">Twilio Phone Number (WhatsApp or SMS)</Label>
                            <Input
                                id="twilioPhoneNumber"
                                name="twilioPhoneNumber"
                                placeholder="+15017122661"
                                value={settings.twilioPhoneNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                             Save Settings
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
