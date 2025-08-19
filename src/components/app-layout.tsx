
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Lightbulb,
  Building2,
  Users,
  Banknote,
  Wrench,
  LineChart,
  Settings,
  Home,
  Briefcase,
  Warehouse,
  FileText,
  Scaling,
  UserCog,
  UserRound,
  FolderKanban,
  GitBranchPlus,
  Heart,
  StickyNote,
  CalendarClock,
  ShoppingBag,
  FileSignature,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sidebar-foreground"
          >
            <Building2 className="h-8 w-8 text-accent" />
            <h1 className="text-xl font-bold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              PropVue
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                tooltip="Dashboard"
              >
                <Link href="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/intelligent-pricing'}
                tooltip="Intelligent Pricing"
              >
                <Link href="/intelligent-pricing">
                  <Lightbulb />
                  <span>Intelligent Pricing</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/property-management'}
                tooltip="Property Management"
              >
                <Link href="/property-management">
                  <Building2 />
                  <span>Property Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/tenant-management'}
                tooltip="Tenant Management"
              >
                <Link href="/tenant-management">
                  <Users />
                  <span>Tenant Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/financials'}
                tooltip="Financials"
              >
                <Link href="/financials">
                  <Banknote />
                  <span>Financials</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/maintenance'}
                tooltip="Maintenance"
              >
                <Link href="/maintenance">
                  <Wrench />
                  <span>Maintenance</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/reports'}
                tooltip="Reports"
              >
                <Link href="/reports">
                  <LineChart />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/settings'}
                tooltip="Settings"
              >
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-auto flex-col border-b bg-background/95 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="flex-1"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://placehold.co/40x40.png"
                      alt="@propvue-user"
                      data-ai-hint="profile picture"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      User
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@propvue.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Menubar className="border-t-0 border-x-0 rounded-none h-auto">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Home className="h-4 w-4 mr-2" />
                HOME
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Briefcase className="h-4 w-4 mr-2" />
                FINANCE
              </MenubarTrigger>
              <MenubarContent className="w-screen max-w-4xl">
                <div className="grid grid-cols-6 gap-x-4 gap-y-2 p-4">
                  <div>
                    <h3 className="font-bold text-sm mb-2">Accounts</h3>
                    <MenubarItem>Chart Of Accounts</MenubarItem>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Receipts &amp; Payments</h3>
                    <MenubarItem>Contract Income</MenubarItem>
                    <MenubarItem>Cash Receipt Voucher - Rent</MenubarItem>
                    <MenubarItem>Postdated Receipt Voucher Others</MenubarItem>
                    <MenubarItem>Contract Income Reversal</MenubarItem>
                    <MenubarItem>Cash Payment Voucher</MenubarItem>
                    <MenubarItem>Postdated Payment Voucher Multiple</MenubarItem>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Journal Entries</h3>
                    <MenubarItem>Journal Voucher Others</MenubarItem>
                    <MenubarItem>Debit Note (JV)</MenubarItem>
                    <MenubarItem>Credit Note (JV)</MenubarItem>
                    <MenubarItem>Opening Balance</MenubarItem>
                    <MenubarItem>Debit Note</MenubarItem>
                    <MenubarItem>Credit Note</MenubarItem>
                  </div>
                   <div>
                    <h3 className="font-bold text-sm mb-2">Manage</h3>
                    <MenubarItem>Manage</MenubarItem>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Fixed Assets</h3>
                    <MenubarItem>Assets</MenubarItem>
                    <MenubarItem>Asset Classes</MenubarItem>
                    <MenubarItem>Depreciation Books</MenubarItem>
                    <MenubarItem>FA Accounts</MenubarItem>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Reports</h3>
                    <MenubarItem>General Ledger</MenubarItem>
                    <MenubarItem>Registers</MenubarItem>
                    <MenubarItem>Receivables &amp; Payables</MenubarItem>
                    <MenubarItem>Final Reports</MenubarItem>
                  </div>
                </div>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Warehouse className="h-4 w-4 mr-2" />
                INVENTORY
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                REPORTS
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Rental Reports</MenubarItem>
                <MenubarItem>Balance</MenubarItem>
                <MenubarItem>Occupancy</MenubarItem>
                <MenubarItem>Availability</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Scaling className="h-4 w-4 mr-2" />
                DIMENSIONS
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <UserCog className="h-4 w-4 mr-2" />
                ADMIN
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Building2 className="h-4 w-4 mr-2" />
                PROPERTY
              </MenubarTrigger>
              <MenubarContent className="w-screen max-w-6xl">
                <div className="grid grid-cols-6 gap-x-4 gap-y-2 p-4">
                  <div>
                    <h3 className="font-bold text-sm mb-2">Properties</h3>
                    <MenubarItem asChild><Link href="/property/units">Units</Link></MenubarItem>
                    <MenubarItem asChild><Link href="/property/properties">Properties</Link></MenubarItem>
                    <MenubarItem>Enquiry</MenubarItem>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Leasing</h3>
                    <MenubarItem>Tenant</MenubarItem>
                    <MenubarItem>Tenancy Contract</MenubarItem>
                    <MenubarItem>Quotation</MenubarItem>
                    <MenubarItem>Purchase Contract</MenubarItem>
                    <MenubarItem>Unit Reservation</MenubarItem>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Manage</h3>
                    <MenubarItem>Manage</MenubarItem>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Operations</h3>
                    <MenubarItem>Book Case Income</MenubarItem>
                    <MenubarItem>Daily Vacant Flat Report</MenubarItem>
                    <MenubarItem>Security Deposit</MenubarItem>
                    <MenubarItem>Console</MenubarItem>
                    <MenubarItem>Cheque / Cash Collection</MenubarItem>
                    <MenubarItem>Floor Wise Expiry</MenubarItem>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Reports</h3>
                    <MenubarItem>Property Profit Report</MenubarItem>
                    <MenubarItem>Tenant Ledger</MenubarItem>
                    <MenubarItem>Bulk Posting</MenubarItem>
                    <MenubarItem>Floor</MenubarItem>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Settings</h3>
                    <MenubarItem>Property Location</MenubarItem>
                    <MenubarItem>Property Block</MenubarItem>
                    <MenubarItem>Floor</MenubarItem>
                    <MenubarItem>Unit Section</MenubarItem>
                    <MenubarItem>Asset</MenubarItem>
                    <MenubarItem>Request Type</MenubarItem>
                    <MenubarItem>Service Category</MenubarItem>
                    <MenubarItem>Service Sub Category</MenubarItem>
                    <MenubarItem>Supervisor</MenubarItem>
                    <MenubarItem>Technician</MenubarItem>
                  </div>
                </div>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <UserRound className="h-4 w-4 mr-2" />
                HRM
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <FolderKanban className="h-4 w-4 mr-2" />
                PROJECTS
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <GitBranchPlus className="h-4 w-4 mr-2" />
                Document Flow
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Banknote className="h-4 w-4 mr-2" />
                Financial
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <StickyNote className="h-4 w-4 mr-2" />
                Sticky Notes
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <CalendarClock className="h-4 w-4 mr-2" />
                Reset Password Calendar
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <ShoppingBag className="h-4 w-4 mr-2" />
                General Sales
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <FileSignature className="h-4 w-4 mr-2" />
                Contracts
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </header>
        <main
          className={cn(
            'flex flex-1 flex-col',
            // remove default padding for pages that want full width
            pathname !== '/' && 'p-4 sm:px-6 sm:py-0 md:gap-8'
          )}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
