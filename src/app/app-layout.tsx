
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Building2,
  Users,
  Banknote,
  LineChart,
  Settings,
  LogOut,
  FileSignature,
  Wrench,
  ChevronDown,
  UserSquare,
  PanelLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/app/admin/user-roles/schema';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useIsMobile } from '@/hooks/use-mobile';


// A type for the user profile stored in session storage
type UserProfile = Omit<UserRole, 'password' | 'lastLogin' | 'status'>;

const navLinks = [
    {
        label: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard />,
    },
    { 
        label: 'Leases', 
        icon: <FileSignature />,
        subItems: [
            { href: '/property/properties/list', label: 'Properties' },
            { href: '/property/units/list', label: 'Units' },
            { href: '/property/rooms/list', label: 'Rooms' },
            { href: '/property/units/vacant', label: 'Vacant Units' },
            { href: '/landlord', label: 'Landlord' },
            { href: '/lease/contracts', label: 'Lease Contracts' },
            { href: '/lease/termination', label: 'Lease Termination' },
        ]
    },
    { 
      label: 'Tenant', 
      icon: <Users />,
      subItems: [
          { href: '/tenancy/tenants', label: 'Tenant' },
          { href: '/tenancy/customer', label: 'Customer' },
          { href: '/tenancy/contracts', label: 'Tenancy Contracts' },
          { href: '/tenancy/termination', label: 'Tenancy Termination' },
      ]
    },
    { 
      label: 'Vendor', 
      icon: <UserSquare />,
      subItems: [
        { href: '/vendors', label: 'Vendors' },
        { href: '/vendors/agents', label: 'Agents' },
      ]
    },
    { 
        label: 'Finance', 
        icon: <Banknote />,
        subItems: [
            { href: '/finance/chart-of-accounts', label: 'Chart of Accounts' },
            { href: '/finance/banking', label: 'Banking' },
            { href: '/finance/cheque-deposit', label: 'Cheque Deposit' },
            { href: '/finance/pdc-cheque', label: 'PDC Cheque' },
            { href: '/finance/payment', label: 'Payment' },
            { href: '/finance/due-payments', label: 'Due Payments' },
            { href: '/finance/cheque-print', label: 'Cheque Print' },
            { href: '/finance/daily-checkout', label: 'Daily Checkout' },
        ]
    },
    {
        label: 'Maintenance',
        icon: <Wrench />,
        subItems: [
            { href: '/maintenance/ticket-issue', label: 'Ticket Issue' },
        ]
    },
    {
        label: 'Workflow',
        href: '/workflow',
        icon: <LineChart />,
    },
    { 
        label: 'Settings', 
        icon: <Settings />,
        subItems: [
            { href: '/admin/user-roles', label: 'User Roles' },
            { href: '/admin/communication', label: 'Communication' },
            { href: '/admin/backup', label: 'Backup & Restore' },
            { href: '/admin/notification', label: 'Notifications' },
        ]
    },
];


function SidebarNav({ isCollapsed, pathname }: { isCollapsed: boolean, pathname: string }) {
    return (
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
            {navLinks.map((link, index) => {
                const hasSubItems = link.subItems && link.subItems.length > 0;
                const isActive = hasSubItems ? link.subItems.some(sub => pathname.startsWith(sub.href)) : link.href ? pathname.startsWith(link.href) : false;

                if (hasSubItems) {
                    return (
                        <Collapsible key={index} defaultOpen={isActive}>
                            <CollapsibleTrigger asChild>
                                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                                    {link.icon}
                                    {!isCollapsed && <span className="ml-4">{link.label}</span>}
                                    {!isCollapsed && <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 ml-4 pl-6 border-l">
                                 {link.subItems!.map(subItem => (
                                     <Link
                                        key={subItem.href}
                                        href={subItem.href}
                                        className={cn(
                                            "block py-2 px-3 text-sm rounded-md",
                                            pathname.startsWith(subItem.href) ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
                                        )}
                                        >
                                        {subItem.label}
                                     </Link>
                                 ))}
                            </CollapsibleContent>
                        </Collapsible>
                    )
                }
                
                return (
                 <Link
                    key={index}
                    href={link.href!}
                    className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted",
                        isActive && "bg-muted font-semibold text-foreground",
                        isCollapsed && "justify-center"
                    )}
                    >
                    {link.icon}
                    {!isCollapsed && <span className="ml-4">{link.label}</span>}
                 </Link>
                )
            })}
        </nav>
    )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (isMobile) {
        setIsCollapsed(true);
    }
  }, [isMobile]);

  React.useEffect(() => {
    if (pathname === '/login') return;

    try {
      const storedProfile = sessionStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Could not parse user profile from session storage:', error);
      router.push('/login');
    }
  }, [pathname, router]);
  
  const handleLogout = () => {
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('openTabs');
    router.push('/login');
  };
  
  if (pathname === '/login' || !userProfile) {
    return <>{children}</>;
  }
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
        <div data-collapsed={isCollapsed} className="hidden border-r bg-sidebar md:flex md:flex-col group transition-[width] duration-300 ease-in-out">
            <div className="flex h-16 items-center justify-between px-4">
                 <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-2 text-lg font-semibold",
                        isCollapsed && "justify-center"
                    )}
                    >
                    <Building2 className="h-6 w-6 text-sidebar-primary" />
                    {!isCollapsed && <span className="font-headline text-sidebar-foreground">PropVue</span>}
                </Link>
                 <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(prev => !prev)} className="md:hidden">
                    <PanelLeft />
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <SidebarNav isCollapsed={isCollapsed} pathname={pathname} />
            </div>
        </div>
        <div className="flex flex-col">
             <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
                 <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(prev => !prev)} className="hidden md:flex">
                    <PanelLeft />
                </Button>
                <Breadcrumbs />
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
    </div>
  );
}
