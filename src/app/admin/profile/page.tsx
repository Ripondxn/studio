'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UserCog, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile, loadUserProfile } from './actions';

type ProfileData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export default function UserProfilePage() {
    const { toast } = useToast();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            const result = await loadUserProfile();
            if (result.success && result.data) {
                setProfile(result.data);
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
    }, [toast]);
    
    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);

        const formData = new FormData(event.currentTarget);
        const result = await updateUserProfile(formData);

        if (result.success) {
            toast({
                title: 'Profile Updated',
                description: 'Your profile has been saved successfully.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        }

        setIsSaving(false);
    };

    if (isLoading || !profile) {
        return (
            <div className="container mx-auto py-10 flex justify-center items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }


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

        <form onSubmit={handleSave}>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your personal and contact information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
                            <AvatarFallback>{profile.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">{profile.firstName} {profile.lastName}</h3>
                            <p className="text-muted-foreground">{profile.email}</p>
                            <Button variant="outline" size="sm" type="button">Change Photo</Button>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" name="firstName" defaultValue={profile.firstName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" name="lastName" defaultValue={profile.lastName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" defaultValue={profile.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" defaultValue={profile.phone} />
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold text-lg">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" name="currentPassword" type="password" placeholder="********" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" name="newPassword" type="password" placeholder="********" />
                            </div>
                        </div>
                    </div>

                </CardContent>
                <div className="p-6 pt-0">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </Card>
        </form>
      </div>
    </div>
  );
}
