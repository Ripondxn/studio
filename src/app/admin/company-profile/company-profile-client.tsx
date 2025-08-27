
'use client';

import { useState } from 'react';
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
import { Loader2, Save, Building2, Upload } from 'lucide-react';
import { saveCompanyProfile } from './actions';
import { companyProfileSchema, CompanyProfile } from './schema';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';


export function CompanyProfileClient({ initialProfile }: { initialProfile: CompanyProfile }) {
    const { toast } = useToast();
    const [logoPreview, setLogoPreview] = useState<string | null>(initialProfile.logo || null);

    const form = useForm<CompanyProfile>({
        resolver: zodResolver(companyProfileSchema),
        defaultValues: initialProfile,
    });
    
    const {
        formState: { isSubmitting },
    } = form;
    
    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
                form.setValue('logo', reader.result as string, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: CompanyProfile) => {
        const result = await saveCompanyProfile(data);
        if (result.success) {
            toast({
                title: 'Profile Saved',
                description: 'Your company profile has been updated.',
            });
            form.reset(data); // To reset the dirty state
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
            <div className="mx-auto max-w-4xl space-y-8">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                        <Building2 className="h-8 w-8" /> Company Profile
                    </h1>
                    <p className="text-muted-foreground">Manage your company's information for invoices, reports, and contracts.</p>
                </div>

                 <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Details</CardTitle>
                            <CardDescription>This information will appear on all official documents.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 rounded-lg">
                                    <AvatarImage src={logoPreview || undefined} alt="Company Logo" className="object-contain" />
                                    <AvatarFallback className="rounded-lg">
                                        <Building2 className="h-10 w-10 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                 <div className="grid gap-1.5">
                                    <Label>Company Logo</Label>
                                     <Input id="logo-upload" type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                                    <Label htmlFor="logo-upload">
                                         <Button type="button" variant="outline" asChild>
                                            <span className="cursor-pointer">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Logo
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
                                        <Label>Company Name</Label>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                           />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Address</Label>
                                        <FormControl><Textarea {...field} /></FormControl>
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
                                    name="poBox"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>P.O. Box</Label>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                               />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="licenseNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Trade License No.</Label>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                               />
                               <FormField
                                    control={form.control}
                                    name="vatNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>VAT Registration No. (TRN)</Label>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                               />
                            </div>

                        </CardContent>
                         <CardFooter>
                             <Button type="submit" disabled={isSubmitting}>
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
