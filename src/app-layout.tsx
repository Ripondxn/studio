
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
  ChevronRight,
  BadgeDollarSign,
  Briefcase,
  Package,
  Route,
  Warehouse,
  Code,
  Receipt,
  FileText as ReportIcon,
  AlertTriangle,
  KeyRound,
  Eraser,
  ScanLine
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/app/admin/user-roles/schema';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCompanyProfile } from '@/context/company-profile-context';
import { checkLicenseStatus, type LicenseStatus } from '@/lib/license';
import { TrialExpiredPage } from '@/components/trial-expired-page';
import { Loader2 } from 'lucide-react';


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
        ]
    },
    { 
      label: 'Tenant', 
      icon: <Users />,
      subItems: [
          { href: '/tenancy/tenants', label: 'Tenant' },
          { href: '/tenancy/customer', label: 'Customer' },
          { href: '/tenancy/contracts', label: 'Tenancy Contracts' },
      ]
    },
    { 
      label: 'Vendor / Supplier', 
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
            { href: '/finance/cheque-management', label: 'Cheque Management' },
            { href: '/finance/receipt-vouchers', label: 'Receipt Vouchers' },
            { href: '/finance/payment', label: 'Payment' },
            { href: '/finance/due-payments', label: 'Due Payments' },
            { href: '/finance/cheque-print', label: 'Cheque Print' },
            { href: '/finance/daily-checkout', label: 'Daily Checkout' },
        ]
    },
    {
        label: 'Data Processing',
        icon: <ScanLine />,
        subItems: [
            { href: '/document-processor', label: 'Document Processor' },
            { href: '/data-processing/single-data-extractor', label: 'Single Data Extractor' },
            { href: '/data-processing/batch-data-extractor', label: 'Batch Data Extractor' },
        ]
    },
     {
        label: 'Products & Services',
        href: '/products',
        icon: <Package />,
    },
     {
        label: 'Vaults & Stores',
        href: '/stores',
        icon: <Warehouse />,
    },
    {
        label: 'Asset Management',
        href: '/assets',
        icon: <Briefcase />,
    },
    {
        label: 'Maintenance',
        icon: <Wrench />,
        subItems: [
            { href: '/maintenance/ticket-issue', label: 'Ticket Issue' },
            { href: '/maintenance/contracts', label: 'Service Contracts' },
        ]
    },
    {
        label: 'Reports',
        href: '/reports',
        icon: <ReportIcon />,
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
            { href: '/admin/profile', label: 'User Profile' },
            { href: '/admin/company-profile', label: 'Company Profile' },
            { href: '/admin/user-roles', label: 'User Roles' },
            { href: '/admin/communication', label: 'Communication' },
            { href: '/admin/backup', label: 'Backup & Restore' },
            { href: '/admin/notification', label: 'Notifications' },
            { href: '/admin/currency', label: 'Currency' },
            { href: '/admin/payment-gateway', label: 'Payment Gateway' },
            { href: '/admin/access-control', label: 'Access Control' },
            { href: '/admin/workflow-settings', label: 'Workflow Settings' },
            { href: '/admin/contract-continuity', label: 'Contract Continuity' },
            { href: '/admin/license', label: 'License Settings' },
            { href: '/admin/developer-credit', label: 'Developer Credit' },
            { href: '/admin/reset-data', label: 'Reset Data' },
        ]
    },
];


function SidebarNav({ isCollapsed, pathname }: { isCollapsed: boolean, pathname: string }) {
    return (
        <nav className="grid gap-1 px-2 text-sm font-medium text-sidebar-foreground group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
            {navLinks.map((link, index) => {
                const hasSubItems = link.subItems && link.subItems.length > 0;
                const isActive = hasSubItems ? link.subItems.some(sub => pathname.startsWith(sub.href)) : link.href ? pathname.startsWith(link.href) : false;

                if (hasSubItems) {
                    return (
                        <Collapsible key={index} defaultOpen={isActive} className="[&_svg]:text-sidebar-muted-foreground">
                            <CollapsibleTrigger asChild>
                                <Button variant={isActive ? "sidebar-accent" : "ghost"} className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                    {link.icon}
                                    {!isCollapsed && <span className="ml-4">{link.label}</span>}
                                    {!isCollapsed && <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 ml-4 my-1 pl-6 border-l border-sidebar-border">
                                 {link.subItems!.map(subItem => (
                                     <Link
                                        key={subItem.href}
                                        href={subItem.href}
                                        className={cn(
                                            "block py-1.5 px-3 text-sm rounded-md text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                            pathname.startsWith(subItem.href) && 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
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
                        "flex items-center rounded-lg px-3 py-2 text-sidebar-muted-foreground transition-colors hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                        isActive && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground",
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

const TrialBanner = ({ licenseStatus }: { licenseStatus: LicenseStatus }) => {
    if (!licenseStatus.isTrial || licenseStatus.daysRemaining > 7) {
        return null;
    }
    
    return (
        <div className="bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
            <AlertTriangle className="inline-block h-4 w-4 mr-2" />
            Your trial expires in {licenseStatus.daysRemaining} {licenseStatus.daysRemaining === 1 ? 'day' : 'days'}. 
            <Button variant="link" className="p-0 h-auto ml-1 text-accent-foreground underline">Upgrade Now</Button>
        </div>
    )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [licenseStatus, setLicenseStatus] = React.useState<LicenseStatus | null>(null);
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { profile: companyProfile } = useCompanyProfile();


  React.useEffect(() => {
    if (isMobile) {
        setIsCollapsed(true);
    }
  }, [isMobile]);

  React.useEffect(() => {
    async function checkUserAndLicense() {
        if (pathname === '/login' || pathname.startsWith('/pay')) return;

        try {
          const storedProfile = sessionStorage.getItem('userProfile');
          if (storedProfile) {
            setUserProfile(JSON.parse(storedProfile));
             const status = await checkLicenseStatus();
             setLicenseStatus(status);
          } else {
            router.push('/login');
          }
        } catch (error) {
          console.error('Could not parse user profile from session storage:', error);
          router.push('/login');
        }
    }
    checkUserAndLicense();
  }, [pathname, router]);
  
  const handleLogout = () => {
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('openTabs');
    router.push('/login');
  };
  
  if (pathname === '/login' || pathname.startsWith('/pay') || !userProfile) {
    return <>{children}</>;
  }

  if (!licenseStatus) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  if (!licenseStatus.isActive) {
    return <TrialExpiredPage daysRemaining={licenseStatus.daysRemaining} expiryDate={licenseStatus.expiryDate} />;
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
                    {companyProfile.logo ? <img src={companyProfile.logo} alt="Company Logo" className="h-8 w-8 object-contain"/> : <Building2 className="h-6 w-6 text-sidebar-primary" />}
                    {!isCollapsed && <span className="font-headline text-sidebar-foreground">{companyProfile.name}</span>}
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
             <header className="sticky top-0 z-40">
                <TrialBanner licenseStatus={licenseStatus} />
                <div className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
                                src=""
                                alt={userProfile.name}
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
                            <DropdownMenuItem asChild><Link href="/admin/company-profile">Company Profile</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            {children}
            </main>
        </div>
    </div>
  );
}
