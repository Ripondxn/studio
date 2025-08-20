
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  LayoutDashboard,
  Building2,
  Users,
  Banknote,
  LineChart,
  Settings,
  LogOut,
  FileSignature,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/app/admin/user-roles/schema';

// A type for the user profile stored in session storage
type UserProfile = Omit<UserRole, 'password' | 'lastLogin' | 'status'>;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    // This code runs only on the client
    if (pathname === '/login') return;

    try {
      const storedProfile = sessionStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        // If no profile, redirect to login.
        router.push('/login');
      }
    } catch (error) {
      console.error('Could not parse user profile from session storage:', error);
      router.push('/login');
    }
  }, [pathname, router]);
  
  const handleLogout = () => {
    sessionStorage.removeItem('userProfile');
    router.push('/login');
  };
  
  if (pathname === '/login' || !userProfile) {
    // Return children directly for login page, or a loader while user profile is being fetched
    return <>{children}</>;
  }
  
  const navLinks = [
    { href: '/', label: 'Dashboard', icon: <LayoutDashboard /> },
    { href: '/property/properties/list', label: 'Leases', icon: <FileSignature /> },
    { href: '/property/tenants', label: 'Tenant', icon: <Users /> },
    { href: '/finance/chart-of-accounts', label: 'Finance', icon: <Banknote /> },
    { href: '/reports', label: 'Reports', icon: <LineChart /> },
    { href: '/admin/user-roles', label: 'Settings', icon: <Settings /> },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                <Building2 className="h-6 w-6 text-primary" />
                <span className="font-headline">PropVue</span>
                </Link>
                {navLinks.map(link => (
                     <Link
                        key={link.href}
                        href={link.href}
                        className={cn("transition-colors hover:text-foreground", pathname === link.href ? "text-foreground" : "text-muted-foreground")}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial">
                    <Select defaultValue="property_management">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="property_management">Property Management</SelectItem>
                            <SelectItem value="trading">Trading</SelectItem>
                            <SelectItem value="payroll">Payroll</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                            src="https://placehold.co/40x40.png"
                            alt={userProfile.name}
                            data-ai-hint="profile picture"
                            />
                            <AvatarFallback>{userProfile.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                            {userProfile.name}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {userProfile.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/admin/profile">Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          {children}
        </main>
    </div>
  );
}
