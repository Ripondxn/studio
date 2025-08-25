
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, BadgeDollarSign } from 'lucide-react';
import { saveCurrencySettings, type CurrencySettings } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

const currencySettingsSchema = z.object({
    currencyCode: z.string().trim().length(3, "Currency code must be 3 characters long.").toUpperCase(),
});

const commonCurrencies = [
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
];

export function CurrencyClient({ initialSettings }: { initialSettings: CurrencySettings }) {
    const { toast } = useToast();
    const router = useRouter();
    const [useCustom, setUseCustom] = useState(!commonCurrencies.some(c => c.code === initialSettings.currencyCode));

    const form = useForm<CurrencySettings>({
        resolver: zodResolver(currencySettingsSchema),
        defaultValues: initialSettings,
    });
    
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = form;

    const handleSave = async (data: CurrencySettings) => {
        const result = await saveCurrencySettings(data);
        if (result.success) {
            toast({
                title: 'Settings Saved',
                description: 'Your currency settings have been updated.',
            });
             // Force a hard reload to update context everywhere
            window.location.reload();
        } else {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        }
    }
    
    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-2xl space-y-8">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                        <BadgeDollarSign className="h-8 w-8" /> Currency Settings
                    </h1>
                    <p className="text-muted-foreground">Set the default currency used throughout the application.</p>
                </div>

                 <form onSubmit={handleSubmit(handleSave)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Global Currency</CardTitle>
                            <CardDescription>This setting affects how monetary values are displayed everywhere.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Select a Common Currency</Label>
                                <Controller
                                    name="currencyCode"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => {
                                                if (value === 'custom') {
                                                    setUseCustom(true);
                                                    setValue('currencyCode', '');
                                                } else {
                                                    setUseCustom(false);
                                                    field.onChange(value);
                                                }
                                            }}
                                            value={useCustom ? 'custom' : field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a currency..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {commonCurrencies.map(c => (
                                                    <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>
                                                ))}
                                                <SelectItem value="custom">Custom Currency</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            {useCustom && (
                                 <div className="space-y-2">
                                    <Label htmlFor="customCurrencyCode">Custom Currency Code (3 Letters)</Label>
                                    <Input
                                        id="customCurrencyCode"
                                        placeholder="e.g., OMR"
                                        {...register('currencyCode')}
                                        maxLength={3}
                                    />
                                    {errors.currencyCode && <p className="text-destructive text-sm mt-1">{errors.currencyCode.message}</p>}
                                </div>
                            )}
                        </CardContent>
                         <CardFooter>
                             <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Settings
                            </Button>
                        </CardFooter>
                    </Card>
                 </form>
            </div>
        </div>
    );
}
