'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UserCog, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile, loadUserProfile } from './actions';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


const profileFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email(),
    phone: z.string().optional(),
    avatar: z.string().nullable().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function UserProfilePage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            avatar: null,
            currentPassword: '',
            newPassword: ''
        }
    });

    const {
        formState: { isSubmitting, isDirty },
    } = form;

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            const result = await loadUserProfile();
            if (result.success && result.data) {
                form.reset(result.data);
                setAvatarPreview(result.data.avatar || null);
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Error loading profile',
                    description: result.error,
                });
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, [toast, form]);
    
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setAvatarPreview(result);
                form.setValue('avatar', result, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };


    const onSubmit = async (data: ProfileFormData) => {
        // In a real app, you would add password verification logic here
        if (data.newPassword && !data.currentPassword) {
            form.setError('currentPassword', { type: 'manual', message: 'Current password is required to set a new one.' });
            return;
        }

        const result = await updateUserProfile(data);

        if (result.success) {
            toast({
                title: 'Profile Updated',
                description: 'Your profile has been saved successfully.',
            });
            form.reset(data); // To reset the dirty state
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 flex justify-center items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

  const profile = form.watch();

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
            <UserCog className="h-10 w-10 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">User Profile</h1>
                <p className="text-muted-foreground">Manage your profile information and settings.</p>
            </div>
        </div>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your personal and contact information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarPreview || undefined} alt="User" />
                            <AvatarFallback>{profile.firstName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">{profile.firstName} {profile.lastName}</h3>
                            <p className="text-muted-foreground">{profile.email}</p>
                            <Input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                            <Label htmlFor="avatar-upload">
                                 <Button type="button" variant="outline" asChild>
                                    <span className="cursor-pointer">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Photo
                                    </span>
                                </Button>
                            </Label>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                         )}/>
                         <FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                         )}/>
                         <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                         )}/>
                         <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                         )}/>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold text-lg">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                           <FormField control={form.control} name="currentPassword" render={({ field }) => (
                                <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" placeholder="********" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="newPassword" render={({ field }) => (
                                <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" placeholder="Leave blank if unchanged" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </div>

                </CardContent>
                <div className="p-6 pt-0">
                    <Button type="submit" disabled={isSubmitting || !isDirty}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </Card>
        </form>
        </Form>
      </div>
    </div>
  );
}
    