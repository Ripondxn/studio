
'use client';

import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';
import { Bell, Loader2, Send } from 'lucide-react';
import { sendNotificationEmail } from './actions';
import { templates } from './templates';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  recipient: z.string().min(1, 'A recipient is required.'),
  subject: z.string().min(1, 'Subject is required.'),
  body: z.string().min(1, 'Email body cannot be empty.'),
});

type NotificationFormData = z.infer<typeof formSchema>;

type Recipient = {
    value: string,
    label: string,
    data: {
        name: string;
        propertyAddress?: string;
        contractEndDate?: string;
        dueAmount?: number;
        dueDate?: string;
    }
}

export function NotificationClient({ recipients }: { recipients: Recipient[] }) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: '',
      subject: '',
      body: ''
    }
  });

  const getRecipientData = useCallback((email: string) => {
    return recipients.find(r => r.value === email)?.data;
  }, [recipients]);

  const populateTemplate = useCallback((templateId: string, recipientEmail: string) => {
    const template = templates.find(t => t.id === templateId);
    const recipientData = getRecipientData(recipientEmail);
    
    if (template && recipientData) {
      form.setValue('subject', template.subject);
      let newBody = template.body;
      newBody = newBody.replace(/\[Recipient Name\]/g, recipientData.name || '[Recipient Name]');
      newBody = newBody.replace(/\[Property\/Service\]/g, recipientData.propertyAddress || '[Property/Service]');
      newBody = newBody.replace(/\[Property Address\]/g, recipientData.propertyAddress || '[Property Address]');
      newBody = newBody.replace(/\[Amount\]/g, recipientData.dueAmount ? String(recipientData.dueAmount) : '[Amount]');
      newBody = newBody.replace(/\[Due Date\]/g, recipientData.dueDate || '[Due Date]');
      newBody = newBody.replace(/\[End Date\]/g, recipientData.contractEndDate || '[End Date]');
      form.setValue('body', newBody);
    } else if (template) {
        form.setValue('subject', template.subject);
        form.setValue('body', template.body);
    }
  }, [form, getRecipientData]);

  const handleTemplateSelect = (templateId: string) => {
    const recipientEmail = form.getValues('recipient');
    populateTemplate(templateId, recipientEmail);
  }
  
  const handleRecipientSelect = (email: string) => {
    form.setValue('recipient', email);
    const templateId = templates.find(t => t.subject === form.getValues('subject'))?.id;
    if (templateId) {
        populateTemplate(templateId, email);
    }
  };


  const onSubmit = async (data: NotificationFormData) => {
    setIsSending(true);
    const result = await sendNotificationEmail(data);
    if(result.success) {
      toast({ title: "Email Sent!", description: "The notification has been sent successfully." });
      form.reset();
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.error || 'Failed to send email.' });
    }
    setIsSending(false);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><Bell /> Notifications Center</h1>
            <p className="text-muted-foreground">Compose and send professional email notifications.</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Compose Notification</CardTitle>
                        <CardDescription>Select a recipient and a template, then customize your message.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                                <Label>Recipient</Label>
                                <Controller
                                    name="recipient"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Combobox
                                            options={recipients.map(r => ({ value: r.value, label: r.label }))}
                                            value={field.value}
                                            onSelect={handleRecipientSelect}
                                            placeholder="Select a recipient..."
                                        />
                                    )}
                                />
                                {form.formState.errors.recipient && <p className="text-destructive text-sm">{form.formState.errors.recipient.message}</p>}
                           </div>
                           <div className="space-y-2">
                                <Label>Template</Label>
                                <Select onValueChange={handleTemplateSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a template..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map(template => (
                                            <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                           </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" {...form.register('subject')} />
                             {form.formState.errors.subject && <p className="text-destructive text-sm">{form.formState.errors.subject.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="body">Email Body</Label>
                            <Textarea id="body" rows={12} {...form.register('body')} />
                             {form.formState.errors.body && <p className="text-destructive text-sm">{form.formState.errors.body.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSending}>
                            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            <Send className="mr-2 h-4 w-4"/>
                            Send Notification
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
      </div>
    </div>
  );
}
