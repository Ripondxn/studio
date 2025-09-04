
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { accountCredentialSchema, type AccountCredential } from './schema';
import { createAccountCredential, updateAccountCredential } from './actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';

interface VaultFormProps {
  userId: string;
  isEditMode?: boolean;
  initialData?: AccountCredential;
}

// We can extend this schema for client-specific validation if needed
const formSchema = accountCredentialSchema;

export function VaultForm({ userId, isEditMode = false, initialData }: VaultFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? initialData : {
        userId,
        accountType: 'other',
        title: '',
        description: '',
        username: '',
        password: '',
        accountNumber: '',
        websiteUrl: '',
        securityQuestions: [],
        notes: ''
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "securityQuestions",
  });

  const accountType = form.watch('accountType');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null);
    startTransition(async () => {
      // Here you would implement client-side encryption for password, accountNumber, and security question answers
      // For this example, we will store them as plain text.

      const result = isEditMode
        ? await updateAccountCredential(initialData!.id!, values)
        : await createAccountCredential(values);

      if (result.success) {
        router.push('/vault');
        router.refresh(); // Re-fetch server components
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle>{isEditMode ? 'Update Credential' : 'Create a New Credential'}</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., My Primary Gmail" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="accountType"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Account Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an account type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="bank">Bank</SelectItem>
                                        <SelectItem value="utility_water">Utility (Water)</SelectItem>
                                        <SelectItem value="utility_electricity">Utility (Electric)</SelectItem>
                                        <SelectItem value="subscription_elife">Subscription (eLife)</SelectItem>
                                        <SelectItem value="subscription_other">Subscription (Other)</SelectItem>
                                        <SelectItem value="telephone">Telephone</SelectItem>
                                        <SelectItem value="third_party">Third Party</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {(accountType === 'email' || accountType.startsWith('utility') || accountType.startsWith('subscription') || accountType === 'third_party') && (
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username / Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {accountType === 'bank' && (
                        <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Account Number (IBAN)</FormLabel>
                                <FormControl>
                                    <Input placeholder="AE..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password / PIN</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter new password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="websiteUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Website URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Additional notes..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <h3 className="text-lg font-medium mb-2">Security Questions</h3>
                        {fields.map((item, index) => (
                            <div key={item.id} className="flex gap-4 items-center mb-4 p-4 border rounded-md">
                                <FormField
                                    control={form.control}
                                    name={`securityQuestions.${index}.question`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Question</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Mother\'s maiden name" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`securityQuestions.${index}.answer`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Answer</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-5 w-5 text-red-500" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ question: '', answer: '' })}>
                           <PlusCircle className="h-4 w-4 mr-2" /> Add Security Question
                        </Button>
                    </div>

                    {error && <p className="text-red-500 font-medium">{error}</p>}
                    
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Credential'}</Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
