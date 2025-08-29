
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Route, Receipt, PlayCircle } from 'lucide-react';
import { saveWorkflowSettings, type WorkflowSettings, runInvoiceGeneration } from './actions';

export function WorkflowSettingsClient({ initialSettings }: { initialSettings: WorkflowSettings }) {
    const { toast } = useToast();
    const [settings, setSettings] = useState<WorkflowSettings>(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleSettingsSave = async () => {
        setIsSaving(true);
        const result = await saveWorkflowSettings(settings);
        if (result.success) {
            toast({
                title: 'Settings Saved',
                description: 'Your workflow settings have been updated.',
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
    
    const handleRunSimulation = async () => {
        setIsSimulating(true);
        const result = await runInvoiceGeneration();
        if (result.success) {
            toast({
                title: 'Simulation Complete',
                description: result.message,
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Simulation Error',
                description: result.error,
            });
        }
        setIsSimulating(false);
    }
    
    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-2xl space-y-8">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><Route className="h-8 w-8" /> Workflow Settings</h1>
                    <p className="text-muted-foreground">Control the document approval process across the application.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Document Approval Process</CardTitle>
                        <CardDescription>
                            Enable or disable the multi-step approval workflow for financial transactions.
                        </CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="approval-process" className="text-base">Enable Approval Workflow</Label>
                                <p className="text-sm text-muted-foreground">
                                    When enabled, transactions require admin and super-admin approval before posting. 
                                    When disabled, transactions are posted immediately.
                                </p>
                            </div>
                            <Switch
                                id="approval-process"
                                checked={settings.approvalProcessEnabled}
                                onCheckedChange={(checked) => setSettings(s => ({...s, approvalProcessEnabled: checked}))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Invoice Automation</CardTitle>
                        <CardDescription>
                            Control the automatic generation of recurring subscription invoices.
                        </CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="invoice-automation" className="text-base">Enable Automatic Invoicing</Label>
                                <p className="text-sm text-muted-foreground">
                                    When enabled, the system will automatically generate invoices for active subscriptions at the start of each month.
                                </p>
                            </div>
                            <Switch
                                id="invoice-automation"
                                checked={settings.automaticInvoiceGenerationEnabled}
                                onCheckedChange={(checked) => setSettings(s => ({...s, automaticInvoiceGenerationEnabled: checked}))}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button variant="outline" onClick={handleRunSimulation} disabled={isSimulating}>
                            {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                             Run Simulation
                        </Button>
                    </CardFooter>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSettingsSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save All Settings
                    </Button>
                </div>
            </div>
        </div>
    );
}
