
"use client";

import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Nav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";

interface SideNavProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

// A mock function to simulate checking user permissions
// In a real app, you would have a proper RBAC check here
const userHasPermission = (item: any) => {
  // For now, let's assume the user is a super admin, admin or accountant
  // and has access to everything we have built.
  const userRoles = ['super admin', 'admin', 'accountant'];

  if (userRoles.includes('super admin')) {
    return true;
  }

  if (item.subLinks) {
    return item.subLinks.some((sub:any) => userHasPermission(sub));
  }

  // Logic to show links based on module permissions
  switch(item.href) {
    case "/finance/book-management": 
      return userRoles.includes('accountant') || userRoles.includes('admin');
    case "/finance/expense":
        return true;
    case "/vault":
        return true;
    // Add other specific checks here
    default: 
      return true; // Default to show if no specific rule
  }
};


export function SideNav({ isCollapsed, setIsCollapsed }: SideNavProps) {
  const pathname = usePathname();

  // Filter nav items based on user permissions
  const filteredNavItems = navItems.filter(item => userHasPermission(item));

  return (
    <div className={cn(
      "relative h-full border-r px-2 group",
      isCollapsed && "px-2"
    )}>
      {!isCollapsed && (
        <div className="absolute -right-3 top-1/2">
          <Button
            onClick={() => setIsCollapsed(true)}
            variant="secondary"
            className="rounded-full p-2"
          >
            <ChevronLeft />
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={isCollapsed}
        links={filteredNavItems.map((item) => ({
          ...item,
          variant: pathname.startsWith(item.href) ? "default" : "ghost",
          subLinks: item.subLinks?.map((sub:any) => ({
            ...sub,
            variant: pathname === sub.href ? "default" : "ghost"
          }))
        }))}
      />
    </div>
  );
}
