'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, CreditCard, ExternalLink } from 'lucide-react';
import { getPaymentGatewaySettings, savePaymentGatewaySettings } from './actions';
import type { z } from 'zod';

const paymentGatewaySettingsSchema = z.object({
    ziinaApiKey: z.string().optional(),
});

type PaymentGatewaySettings = z.infer<typeof paymentGatewaySettingsSchema>;

export default function PaymentGatewayPage() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<PaymentGatewaySettings>({ ziinaApiKey: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getPaymentGatewaySettings().then(data => {
            setSettings(data);
            setIsLoading(false);
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await savePaymentGatewaySettings(settings);
        if (result.success) {
            toast({
                title: 'Settings Saved',
                description: 'Your payment gateway settings have been updated.',
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
                    <h1 className="text-3xl font-bold font-headline">Payment Gateway Settings</h1>
                    <p className="text-muted-foreground">Integrate online payment solutions to receive payments seamlessly.</p>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <img src="https://ziina.com/ziina-logo-dark.svg" alt="Ziina Logo" className="h-10" />
                            <div>
                                <CardTitle>Ziina Payment Gateway</CardTitle>
                                <CardDescription>
                                    Configure settings for receiving payments via Ziina in the UAE.
                                    <a href="https://ziina.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary text-sm hover:underline ml-2">
                                        Visit Ziina <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="ziinaApiKey">Ziina API Key</Label>
                            <Input
                                id="ziinaApiKey"
                                name="ziinaApiKey"
                                type="password"
                                placeholder="********************************"
                                value={settings.ziinaApiKey}
                                onChange={handleInputChange}
                            />
                             <p className="text-xs text-muted-foreground">You can find your API key in your Ziina dashboard settings.</p>
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
