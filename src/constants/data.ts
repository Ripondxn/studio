
import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
    moduleId: "dashboard",
  },
  {
    title: "Tenancy",
    href: "/tenancy",
    icon: "users",
    label: "Tenancy",
    moduleId: "tenant",
    subLinks: [
      { title: "Tenants", href: "/tenancy/tenants", icon: "user", label: "Tenants" },
      {
        title: "Contracts",
        href: "/tenancy/contracts",
        icon: "fileText",
        label: "Contracts",
      },
    ],
  },
  {
    title: "Property",
    href: "/property",
    icon: "building",
    label: "Property",
    moduleId: "lease",
    subLinks: [
      { title: "List", href: "/property/properties/list", icon: "list", label: "List" },
      { title: "Units", href: "/property/units/list", icon: "home", label: "Units" },
      { title: "Rooms", href: "/property/rooms/list", icon: "doorOpen", label: "Rooms" },
    ],
  },
  {
    title: "Lease",
    href: "/lease",
    icon: "fileSignature",
    label: "Lease",
    moduleId: "lease",
    subLinks: [
      {
        title: "Landlords",
        href: "/lease/landlords",
        icon: "userTie",
        label: "Landlords",
      },
      {
        title: "Contracts",
        href: "/lease/contracts",
        icon: "fileText",
        label: "Contracts",
      },
    ],
  },
  {
    title: "Finance",
    href: "/finance",
    icon: "dollarSign",
    label: "Finance",
    moduleId: "finance",
    subLinks: [
      {
        title: "Chart of Accounts",
        href: "/finance/chart-of-accounts",
        icon: "book",
        label: "Chart of Accounts",
      },
      {
        title: "Journal Entry",
        href: "/finance/journal-entry",
        icon: "bookOpen",
        label: "Journal Entry",
      },
      {
        title: "Banking",
        href: "/finance/banking",
        icon: "landmark",
        label: "Banking",
      },
      {
        title: "Expense",
        href: "/finance/expense",
        icon: "receipt",
        label: "Expense",
      },
    ],
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: "wrench",
    label: "Maintenance",
    moduleId: "maintenance",
    subLinks: [
      {
        title: "Ticket Issue",
        href: "/maintenance/ticket-issue",
        icon: "ticket",
        label: "Ticket Issue",
      },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: "filePieChart",
    label: "Reports",
    moduleId: "report",
  },
  {
    title: "Products",
    href: "/products",
    icon: "package",
    label: "Products",
    moduleId: "product",
  },
  {
    title: "Admin",
    href: "/admin",
    icon: "settings",
    label: "Admin",
    moduleId: "admin",
    subLinks: [
      {
        title: "Access Control",
        href: "/admin/access-control",
        icon: "userLock",
        label: "Access Control",
      },
      {
        title: "Contract Continuity",
        href: "/admin/contract-continuity",
        icon: "shuffle",
        label: "Contract Continuity",
      },
      {
        title: "Company Profile",
        href: "/admin/company-profile",
        icon: "building2",
        label: "Company Profile",
      },
    ],
  },
];
