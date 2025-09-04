
import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Finance",
    href: "/finance",
    icon: "dollarSign",
    label: "Finance",
    subLinks: [
        {
            title: "Book Management",
            href: "/finance/book-management",
            icon: "book",
            label: "Book Management",
        }
    ]
  },
  {
    title: "Access Control",
    href: "/admin/access-control",
    icon: "userLock",
    label: "Access Control",
  },
];
