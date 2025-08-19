
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UserCog } from 'lucide-react';

export default function UserProfilePage() {
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

        <Card>
            <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold">Admin User</h3>
                        <p className="text-muted-foreground">admin@propvue.com</p>
                        <Button variant="outline" size="sm">Change Photo</Button>
                    </div>
                </div>
                
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Admin" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="User" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="admin@propvue.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (123) 456-7890" />
                    </div>
                </div>

                 <Separator />

                 <div>
                    <h3 className="font-semibold text-lg">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                        </div>
                    </div>
                 </div>

            </CardContent>
            <div className="p-6 pt-0">
                 <Button>Save Changes</Button>
            </div>
        </Card>
      </div>
    </div>
  );
}

    