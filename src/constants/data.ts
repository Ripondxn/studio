
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
            title: "Expense",
            href: "/finance/expense",
            icon: "receipt",
            label: "Expense",
        }
    ]
  },
  {
    title: "Vault",
    href: "/vault",
    icon: "shieldCheck",
    label: "Vault",
  },
  {
    title: "Access Control",
    href: "/admin/access-control",
    icon: "userLock",
    label: "Access Control",
  },
];
