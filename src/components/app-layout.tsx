
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
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Lightbulb,
  Building2,
  ChevronDown,
  Users,
  Banknote,
  Wrench,
  LineChart,
  Settings,
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
            <h1 className="text-xl font-bold font-headline text-sidebar-foreground">
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
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span>Prestige Properties</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuItem>HOME</DropdownMenuItem>
                <DropdownMenuItem>FINANCE</DropdownMenuItem>
                <DropdownMenuItem>INVENTORY</DropdownMenuItem>
                <DropdownMenuItem>REPORTS</DropdownMenuItem>
                <DropdownMenuItem>DIMENSIONS</DropdownMenuItem>
                <DropdownMenuItem>ADMIN</DropdownMenuItem>
                <DropdownMenuItem>PROPERTY HRM</DropdownMenuItem>
                <DropdownMenuItem>PROJECTS</DropdownMenuItem>
                <DropdownMenuItem>Document Flow</DropdownMenuItem>
                <DropdownMenuItem>Financial</DropdownMenuItem>
                <DropdownMenuItem>Favorites</DropdownMenuItem>
                <DropdownMenuItem>Sticky Notes</DropdownMenuItem>
                <DropdownMenuItem>Reset Password Calendar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>General Sales</DropdownMenuLabel>
                <DropdownMenuItem>Rental Reports</DropdownMenuItem>
                <DropdownMenuItem>Balance</DropdownMenuItem>
                <DropdownMenuItem>Occupancy</DropdownMenuItem>
                <DropdownMenuItem>Availability</DropdownMenuItem>
                <DropdownMenuItem>Contracts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
