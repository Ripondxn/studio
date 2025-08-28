
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Code, Upload } from 'lucide-react';
import { getDeveloperProfile, saveDeveloperProfile } from './actions';
import { developerProfileSchema, type DeveloperProfile } from './schema';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';


export default function DeveloperCreditPage() {
    const { toast } = useToast();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const form = useForm<DeveloperProfile>({
        resolver: zodResolver(developerProfileSchema),
        defaultValues: {
            name: '',
            email: '',
            website: '',
            bio: '',
            avatar: null,
        }
    });

    useEffect(() => {
        getDeveloperProfile().then(profile => {
            form.reset(profile);
            setAvatarPreview(profile.avatar);
        });
    }, [form]);
    
    const {
        formState: { isSubmitting, isDirty },
    } = form;
    
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                form.setValue('avatar', reader.result as string, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: DeveloperProfile) => {
        const result = await saveDeveloperProfile(data);
        if (result.success) {
            toast({
                title: 'Profile Saved',
                description: 'The developer credit information has been updated.',
            });
            form.reset(data); // To reset the dirty state
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
                        <Code className="h-8 w-8" /> Developer Credit
                    </h1>
                    <p className="text-muted-foreground">Manage the information for the software developer.</p>
                </div>

                 <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Developer Profile</CardTitle>
                            <CardDescription>This information will be displayed in the app's credit section.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 rounded-lg">
                                    <AvatarImage src={avatarPreview || undefined} alt="Developer Avatar" className="object-cover" />
                                    <AvatarFallback className="rounded-lg">
                                        <Code className="h-10 w-10 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                 <div className="grid gap-1.5">
                                    <Label>Developer Avatar</Label>
                                     <Input id="logo-upload" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                                    <Label htmlFor="logo-upload">
                                         <Button type="button" variant="outline" asChild>
                                            <span className="cursor-pointer">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Avatar
                                            </span>
                                        </Button>
                                    </Label>
                                    <p className="text-xs text-muted-foreground">Recommended size: 200x200px</p>
                                </div>
                            </div>
                           <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Developer Name</Label>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                           />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Email</Label>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                               />
                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Website</Label>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                               />
                            </div>
                           <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Short Bio</Label>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                           />
                        </CardContent>
                         <CardFooter>
                             <Button type="submit" disabled={isSubmitting || !isDirty}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                 </form>
                 </Form>
            </div>
        </div>
    );
}
